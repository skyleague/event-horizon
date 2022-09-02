import type { LambdaContext } from './events/context'
import { handleEventBridgeEvent } from './events/eventbridge/handler'
import type { EventBridgeHandler } from './events/eventbridge/types'
import { handleHttpEvent } from './events/http/handler'
import type { GatewayVersion, HttpHandler } from './events/http/types'
import { handleKinesisEvent } from './events/kinesis/handler'
import type { KinesisHandler } from './events/kinesis/types'
import { handleRawEvent } from './events/raw/handler'
import type { RawHandler } from './events/raw/types'
import { handleSecretRotationEvent } from './events/secret-rotation/handler'
import type { SecretRotationHandler, SecretRotationServices } from './events/secret-rotation/types'
import { handleSnsEvent } from './events/sns/handler'
import type { SnsHandler } from './events/sns/types'
import { errorHandler } from './functions/common/error-handler'
import { loggerContext } from './functions/common/logger-context'
import { metricsContext } from './functions/common/metrics-context'
import { traceInvocation } from './functions/common/trace-invocation'
import { warmup } from './functions/common/warmup'
import { logger as globalLogger } from './observability/logger'
import { metrics as globalMetrics } from './observability/metrics'
import { tracer as globalTracer } from './observability/tracer'
import type { RawRequest, RawResponse } from './types'

import type { Handler, APIGatewayProxyEvent, Context, SNSEventRecord, KinesisStreamRecord } from 'aws-lambda'

export type EventHandler<
    C = unknown,
    S = unknown,
    HttpB = unknown,
    HttpP = unknown,
    HttpQ = unknown,
    HttpH = unknown,
    HttpR = unknown,
    RawE = unknown,
    RawR = unknown,
    EbE = unknown,
    EbR = unknown,
    SnsE = unknown,
    KinesisE = unknown,
    KinesisR = unknown,
    GV extends GatewayVersion = 'v1'
> =
    | EventBridgeHandler<C, S, EbE, EbR>
    | HttpHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
    | KinesisHandler<C, S, KinesisE, KinesisR>
    | RawHandler<C, S, RawE, RawR>
    | SnsHandler<C, S, SnsE>
    | (S extends SecretRotationServices ? SecretRotationHandler<C, S> : never)

export async function handleEvent(definition: EventHandler, request: RawRequest, context: LambdaContext) {
    if ('headers' in request) {
        return handleHttpEvent(definition, request, context)
    } else if ('detail' in request) {
        return handleEventBridgeEvent(definition as EventBridgeHandler, request, context)
    } else if ('SecretId' in request && 'Step' in request) {
        return handleSecretRotationEvent(
            definition as unknown as SecretRotationHandler,
            request,
            context as unknown as LambdaContext<unknown, SecretRotationServices>
        )
    } else if ('Records' in request) {
        const unprocessable: unknown[] = []
        const snsRecords: SNSEventRecord[] = []
        const kinesisRecords: KinesisStreamRecord[] = []
        for (const record of request.Records) {
            if ('Sns' in record) {
                snsRecords.push(record)
            } else if ('kinesis' in record) {
                kinesisRecords.push(record)
            } else {
                unprocessable.push(record)
            }
        }

        if (snsRecords.length > 0 && snsRecords.length === request.Records.length) {
            return handleSnsEvent(definition, snsRecords, context)
        }
        if (kinesisRecords.length > 0 && kinesisRecords.length === request.Records.length) {
            return handleKinesisEvent(definition, kinesisRecords, context)
        }
    }

    return handleRawEvent(definition, request, context)
}

export function event<
    C,
    S,
    HttpB,
    HttpP,
    HttpQ,
    HttpH,
    HttpR,
    RawE,
    RawR,
    EbE,
    EbR,
    SnsE,
    KinesisE,
    KinesisR,
    D,
    GV extends GatewayVersion = 'v1'
>(
    definition: D & EventHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, RawE, RawR, EbE, EbR, SnsE, KinesisE, KinesisR, GV>
): D & Handler<APIGatewayProxyEvent> {
    async function handler(request: RawRequest, context: Context): Promise<RawResponse> {
        const lambdaContext: LambdaContext = {
            logger: globalLogger,
            metrics: globalMetrics,
            tracer: globalTracer,
            isSensitive: definition.isSensitive ?? false,
            raw: context,
            services: definition.services,
            config: definition.config,
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
