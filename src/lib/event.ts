import type { LambdaContext } from './events/context'
import { handleHttpEvent } from './events/http/handler'
import type { GatewayVersion, HttpEventHandler } from './events/http/types'
import { loggerContext } from './functions/common/logger-context'
import { metricsContext } from './functions/common/metrics-context'
import { traceInvocation } from './functions/common/trace-invocation'
import { warmup } from './functions/common/warmup'
import { logger as globalLogger } from './observability/logger'
import { metrics as globalMetrics } from './observability/metrics'
import { tracer as globalTracer } from './observability/tracer'
import type { RawRequest, RawResponse } from './types'

import type { Handler, APIGatewayProxyEvent, Context } from 'aws-lambda'

export interface EventHandler<
    HttpB = unknown,
    HttpP = unknown,
    HttpQ = unknown,
    HttpH = unknown,
    HttpR = unknown,
    GV extends GatewayVersion = 'v1'
> {
    http?: HttpEventHandler<HttpB, HttpP, HttpQ, HttpH, HttpR, GV>

    operationId?: string
    summary?: string
    description?: string
    tags?: string[]
    logEvent?: boolean
    isSensitive?: boolean
}

export function handleEvent(definition: EventHandler, request: RawRequest, context: LambdaContext) {
    if ('headers' in request) {
        return handleHttpEvent(definition.http, request, context)
    } else if ('detail' in request) {
        // return definition.eventbridge?.handler(request, context)
    } else if ('source' in request) {
        // return definition.schedule?.handler(request, context)
    } else if ('secretId' in request) {
        // return definition.secret?.handler(request, context)
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

    throw new Error('not implemented')
}

export function event<HttpB, HttpP, HttpQ, HttpH, HttpR, GV extends GatewayVersion>(
    definition: EventHandler<HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
): Handler<APIGatewayProxyEvent> {
    async function handler(request: RawRequest, context: Context): Promise<RawResponse> {
        const lambdaContext: LambdaContext = {
            logger: globalLogger,
            metrics: globalMetrics,
            tracer: globalTracer,
            isSensitive: definition.isSensitive ?? false,
            raw: context,
        }

        const warmupFn = warmup()
        const tracerFn = traceInvocation(lambdaContext)
        const metricsFn = metricsContext(lambdaContext)
        const loggerContextFn = loggerContext(lambdaContext)

        if (warmupFn.before(request)) {
            return
        }

        try {
            tracerFn.before()
            metricsFn.before()
            loggerContextFn.before(request, context)

            // isolate the context logger
            lambdaContext.logger = lambdaContext.logger.child()

            const response = await handleEvent(definition as EventHandler, request, lambdaContext)

            metricsFn.after()
            tracerFn.after(response)
        } catch (error: unknown) {
            try {
                for (const eh of [tracerFn.onError]) {
                    eh(error as Error)
                }
            } catch (resolverError: unknown) {
                void 0
                throw resolverError
            }
        }
    }
    return handler
}
