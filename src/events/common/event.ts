import type { LambdaHandler, RawRequest, RawResponse } from './raw-aws.js'

import { constants } from '../../constants.js'
import { errorHandler } from '../../events/common/functions/error-handler.js'
import { loggerContext } from '../../events/common/functions/logger-context.js'
import { metricsContext } from '../../events/common/functions/metrics-context.js'
import { profileHandler } from '../../events/common/functions/profile-handler.js'
import { traceInvocation } from '../../events/common/functions/trace-invocation.js'
import { traceServices } from '../../events/common/functions/trace-services.js'
import { warmup } from '../../events/common/functions/warmup.js'
import type { DefaultServices, EventHandlerDefinition, LambdaContext } from '../../events/types.js'
import type { Logger } from '../../observability/logger/logger.js'
import { logger as globalLogger } from '../../observability/logger/logger.js'
import type { Metrics } from '../../observability/metrics/metrics.js'
import { metrics as globalMetrics } from '../../observability/metrics/metrics.js'
import type { Tracer } from '../../observability/tracer/tracer.js'
import { tracer as globalTracer } from '../../observability/tracer/tracer.js'

import type { Try } from '@skyleague/axioms'
import { isFunction, mapTry, memoize, transformTry, tryToError } from '@skyleague/axioms'
import type { Context } from 'aws-lambda'
import AWSXRay from 'aws-xray-sdk-core'

import { randomUUID } from 'node:crypto'

export async function createLambdaContext<Configuration, Service, Profile>({
    definition,
    context,
    services,
    config,
    traceId,
    requestId,
    traceIdGenerator = constants.traceIdGenerator,
    requestIdGenerator = constants.requestIdGenerator,
    logger = globalLogger,
    metrics = globalMetrics,
    tracer = globalTracer,
}: {
    definition: EventHandlerDefinition<Configuration, Service, Profile>
    context: Context
    services: Promise<Service> | Service
    config: Configuration | Promise<Configuration>
    traceId: string | undefined
    requestId: string | undefined
    traceIdGenerator?: string
    requestIdGenerator?: string
    logger: Logger
    metrics: Metrics
    tracer: Tracer
}): Promise<LambdaContext<Configuration, Service, Profile>> {
    return {
        logger,
        metrics,
        tracer,
        isSensitive: definition.isSensitive ?? false,
        traceId: traceId ?? (traceIdGenerator === 'uuid' ? randomUUID : randomUUID)(),
        requestId: requestId ?? (requestIdGenerator === 'uuid' ? randomUUID : randomUUID)(),
        raw: context,
        services: (await services) as never,
        config: (await config) as never,
        profile: {} as never,
    }
}

/**
 * @internal
 */
export interface EventHandlerOptions<R, Configuration, Service, Profile> {
    handler: (request: RawRequest | null | undefined, context: LambdaContext<Configuration, Service, Profile>) => Promise<Try<R>>
    traceId?: (request: RawRequest) => string | undefined
    requestId?: (request: RawRequest) => string | undefined
    eagerHandlerInitialization?: boolean
}

AWSXRay.setContextMissingStrategy(() => {
    // do not log errors on the cold start
})
export type EventHandlerFn<Configuration, Service extends DefaultServices | undefined, Profile, R = unknown> = LambdaHandler &
    EventHandlerDefinition<Configuration, Service, Profile> & {
        _options: EventHandlerOptions<R, Configuration, Service, Profile>
    }

export function eventHandler<R, Configuration, Service extends DefaultServices | undefined, Profile>(
    definition: EventHandlerDefinition<Configuration, Service, Profile>,
    options: EventHandlerOptions<R, Configuration, Service, Profile>
): EventHandlerFn<Configuration, Service, Profile, R> {
    const { handler: kernel, eagerHandlerInitialization = constants.eagerHandlerInitialization } = options
    const { logger = globalLogger, metrics = globalMetrics, tracer = globalTracer, services: servicesFn } = definition

    const traceServicesFn = traceServices({ tracer })

    const config = memoize((): Configuration | Promise<Configuration> =>
        // Config is allowed to be undefined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,
        isFunction(definition.config) ? definition.config() : definition.config!
    )
    const services = memoize((): Promise<Service> | Service =>
        // Services is allowed to be undefined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        traceServicesFn.before(isFunction(servicesFn) ? Promise.resolve(config()).then((c) => servicesFn(c)) : servicesFn!)
    )
    if (eagerHandlerInitialization) {
        void services()
    }

    const warmupFn = warmup()
    const profileFn = profileHandler(definition, services)

    async function handler(request: RawRequest, context: Context): Promise<RawResponse> {
        const lambdaContext = await createLambdaContext<Configuration, Service, Profile>({
            definition,
            context,
            services: services(),
            config: config(),
            requestId: options.requestId?.(request),
            traceId: options.traceId?.(request),
            // isolate the context logger
            logger: logger.child(),
            metrics,
            tracer,
        })
        const tracerFn = traceInvocation(lambdaContext)
        const metricsFn = metricsContext(lambdaContext)
        const loggerContextFn = loggerContext(lambdaContext)
        const errorHandlerFn = errorHandler(lambdaContext)

        if (warmupFn.before(request)) {
            return
        }

        tracerFn.before()
        metricsFn.before()
        loggerContextFn.before(request, context)

        const ctx = await mapTry(lambdaContext, async (c) => {
            c.profile = (await profileFn.before()) as never
            return c
        })

        const tryResponse = await mapTry(ctx, (c) => kernel(request, c))

        const response = transformTry(
            tryResponse,
            (s): R => {
                metricsFn.after()
                tracerFn.after(s)

                return s
            },
            (f) => {
                for (const eh of [errorHandlerFn.onError, tracerFn.onError, metricsFn.onError]) {
                    f = eh(f) ?? f
                }
                return errorHandlerFn.onExit(f)
            }
        )

        return tryToError(response)
    }
    Object.assign(handler, definition, { _options: options })
    return handler as unknown as EventHandlerFn<Configuration, Service, Profile, R>
}
