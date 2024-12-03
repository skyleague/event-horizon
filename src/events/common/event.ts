import { randomUUID } from 'node:crypto'
import type { Try } from '@skyleague/axioms'
import { isFunction, mapTry, memoize, transformTry, tryToError } from '@skyleague/axioms'
import type { Context } from 'aws-lambda'
import { eventConstants, initConstants } from '../../constants.js'
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
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type AsConfig, asConfig } from './config.js'
import type { RawRequest, RawResponse } from './raw-aws.js'

export async function createLambdaContext<Configuration, Service, Profile extends MaybeGenericParser>({
    definition,
    context,
    services,
    config,
    traceId,
    requestId,
    traceIdGenerator = eventConstants.traceIdGenerator,
    requestIdGenerator = eventConstants.requestIdGenerator,
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

        getRemainingTimeInMillis: context.getRemainingTimeInMillis.bind(context),
    }
}

/**
 * @internal
 */
export interface EventHandlerOptions<R, Configuration, Service, Profile extends MaybeGenericParser> {
    handler: (request: RawRequest | null | undefined, context: LambdaContext<Configuration, Service, Profile>) => Promise<Try<R>>
    traceId?: (request: RawRequest) => string | undefined
    requestId?: (request: RawRequest) => string | undefined
    eagerHandlerInitialization?: boolean
}

export type EventHandlerFn<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile extends MaybeGenericParser,
    R = unknown,
> = ((request: RawRequest | null | undefined, context: Context) => Promise<Try<R>>) &
    EventHandlerDefinition<Configuration, Service, Profile> & {
        _options: EventHandlerOptions<R, Configuration, Service, Profile>
    }

export function eventHandler<
    R,
    Configuration,
    Service extends DefaultServices | undefined,
    Profile extends MaybeGenericParser,
    D,
>(
    definition: EventHandlerDefinition<Configuration, Service, Profile> & D,
    options: EventHandlerOptions<R, Configuration, Service, Profile>,
): D & EventHandlerFn<Configuration, Service, Profile, R> {
    const { handler: kernel, eagerHandlerInitialization = initConstants.eagerHandlerInitialization } = options
    const { logger = globalLogger, metrics = globalMetrics, tracer = globalTracer, services: servicesFn } = definition

    const traceServicesFn = traceServices({ tracer })

    const config = memoize(async (): Promise<AsConfig<Configuration>> => {
        // biome-ignore lint/style/noNonNullAssertion: Config is allowed to be undefined
        return Promise.resolve(isFunction(definition.config) ? definition.config() : definition.config!).then(
            (c): AsConfig<Configuration> => (c !== undefined ? asConfig(c) : undefined) as AsConfig<Configuration>,
        )
    })

    const services = memoize(
        async (): Promise<Service> =>
            // biome-ignore lint/style/noNonNullAssertion:  Services is allowed to be undefined
            Promise.resolve(isFunction(servicesFn) ? config().then((c) => servicesFn(c)) : servicesFn!).then((s) =>
                traceServicesFn.before(s),
            ),
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
            return mapTry(await profileFn.before(), (profile) => {
                c.profile = profile
                return c
            })
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
                let fn = f
                for (const eh of [errorHandlerFn.onError, tracerFn.onError, metricsFn.onError]) {
                    fn = eh(fn) ?? fn
                }
                return errorHandlerFn.onExit(fn)
            },
        )

        return tryToError(response)
    }
    Object.assign(handler, definition, { _options: options })
    return handler as unknown as EventHandlerFn<Configuration, Service, Profile, R> & D
}
