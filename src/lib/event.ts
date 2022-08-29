import type { LambdaContext } from './events/context'
import { handleEventBridgeEvent } from './events/eventbridge/handler'
import type { EventBridgeHandler } from './events/eventbridge/types'
import { handleHttpEvent } from './events/http/handler'
import type { GatewayVersion, HttpHandler } from './events/http/types'
import { handleRawEvent } from './events/raw/handler'
import type { RawHandler } from './events/raw/types'
import { handleSecretRotationEvent } from './events/secret-rotation/handler'
import type { SecretRotationHandler, SecretRotationServices } from './events/secret-rotation/types'
import { errorHandler } from './functions/common/error-handler'
import { loggerContext } from './functions/common/logger-context'
import { metricsContext } from './functions/common/metrics-context'
import { traceInvocation } from './functions/common/trace-invocation'
import { warmup } from './functions/common/warmup'
import { logger as globalLogger } from './observability/logger'
import { metrics as globalMetrics } from './observability/metrics'
import { tracer as globalTracer } from './observability/tracer'
import type { RawRequest, RawResponse, Services } from './types'

import type { Handler, APIGatewayProxyEvent, Context } from 'aws-lambda'

export type EventHandler<
    S extends Services | undefined = undefined,
    HttpB = unknown,
    HttpP = unknown,
    HttpQ = unknown,
    HttpH = unknown,
    HttpR = unknown,
    RawE = unknown,
    RawR = unknown,
    EbE = unknown,
    EbR = unknown,
    GV extends GatewayVersion = 'v1'
> =
    | EventBridgeHandler<S, EbE, EbR>
    | HttpHandler<S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
    | RawHandler<S, RawE, RawR>
    | (S extends SecretRotationServices ? SecretRotationHandler<S> : never)

export function handleEvent(definition: EventHandler, request: RawRequest, context: LambdaContext) {
    if ('headers' in request) {
        return handleHttpEvent(definition, request, context)
    } else if ('detail' in request) {
        return handleEventBridgeEvent(definition as EventBridgeHandler<undefined>, request, context)
    } else if ('source' in request) {
        // return definition.schedule?.handler(request, context)
    } else if ('SecretId' in request && 'Step' in request) {
        return handleSecretRotationEvent(
            definition as unknown as SecretRotationHandler<SecretRotationServices>,
            request,
            context as unknown as LambdaContext<SecretRotationServices>
        )
    } else if ('Records' in request) {
        for (const record of request.Records) {
            if ('Sns' in record) {
                // return definition.sns?.handler(record, context)
            } else if ('dynamodb' in record) {
                // return definition.dynamodb?.handler(record, context)
            } else if ('messageAttributes' in record) {
                // return definition.sqs?.handler(record, context)
            } else if ('cf' in record) {
                // return definition.cf?.handler(record.cf, context)
            } else if ('ses' in record) {
                // return definition.ses?.handler(record, context)
            }
        }
    }

    return handleRawEvent(definition, request, context)
}

export function event<
    D,
    S extends Services | undefined,
    HttpB,
    HttpP,
    HttpQ,
    HttpH,
    HttpR,
    RawE,
    RawR,
    GV extends GatewayVersion = 'v1'
>(definition: D & EventHandler<S, HttpB, HttpP, HttpQ, HttpH, HttpR, RawE, RawR, GV>): D & Handler<APIGatewayProxyEvent> {
    async function handler(request: RawRequest, context: Context): Promise<RawResponse> {
        const lambdaContext: LambdaContext = {
            logger: globalLogger,
            metrics: globalMetrics,
            tracer: globalTracer,
            isSensitive: definition.isSensitive ?? false,
            raw: context,
            // this type is checked on the declaration: and will be correct on the handlers
            services: definition.services as undefined,
        }

        const warmupFn = warmup()
        const tracerFn = traceInvocation(lambdaContext)
        const metricsFn = metricsContext(lambdaContext)
        const loggerContextFn = loggerContext(lambdaContext)
        const errorHandlerFn = errorHandler(lambdaContext)

        if (warmupFn.before(request)) {
            return
        }

        try {
            tracerFn.before()
            metricsFn.before()
            loggerContextFn.before(request, context)

            // isolate the context logger
            lambdaContext.logger = lambdaContext.logger.child()

            const response = await handleEvent(definition as unknown as EventHandler, request, lambdaContext)

            metricsFn.after()
            tracerFn.after(response)

            return response
        } catch (error: unknown) {
            try {
                for (const eh of [errorHandlerFn.onError, tracerFn.onError]) {
                    eh(error as Error)
                }
                throw error
            } catch (resolverError: unknown) {
                void 0
                throw resolverError
            }
        }

        return
    }
    Object.assign(handler, definition)
    return handler as unknown as D & Handler<APIGatewayProxyEvent>
}
