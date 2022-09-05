import { handleTokenAuthorizerEvent } from './events/authorizer/handler'
import type { AuthorizerHandler } from './events/authorizer/types'
import type { LambdaContext } from './events/context'
import { handleEventBridgeEvent } from './events/eventbridge/handler'
import type { EventBridgeHandler } from './events/eventbridge/types'
import { handleFirehoseTransformation } from './events/firehose/handler'
import type { FirehoseTransformationHandler } from './events/firehose/types'
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
import { handleSqsEvent } from './events/sqs/handler'
import type { SQSHandler } from './events/sqs/types'
import { errorHandler } from './functions/common/error-handler'
import { loggerContext } from './functions/common/logger-context'
import { metricsContext } from './functions/common/metrics-context'
import { traceInvocation } from './functions/common/trace-invocation'
import { warmup } from './functions/common/warmup'
import { logger as globalLogger } from './observability/logger'
import { metrics as globalMetrics } from './observability/metrics'
import { tracer as globalTracer } from './observability/tracer'
import type { AWSLambdaHandler, RawRequest, RawResponse } from './types'

import { isFunction } from '@skyleague/axioms'
import type { Context, SNSEventRecord, KinesisStreamRecord, FirehoseTransformationEventRecord, SQSRecord } from 'aws-lambda'

export type EventHandler<C = unknown, S = unknown> =
    | AuthorizerHandler
    | EventBridgeHandler
    | FirehoseTransformationHandler
    | HttpHandler
    | KinesisHandler
    | RawHandler
    | SnsHandler
    | SQSHandler
    | (S extends SecretRotationServices ? SecretRotationHandler<C, S> : never)

export async function handleEvent(definition: EventHandler, request: RawRequest, context: LambdaContext) {
    if ('authorizationToken' in request || 'type' in request) {
        if ('token' in definition) {
            return handleTokenAuthorizerEvent(definition, request, context)
        } else if ('request' in definition) {
            // return handleAuthorizerEvent(definition, request, context)
        }
    } else if ('headers' in request) {
        if ('http' in definition) {
            return handleHttpEvent(definition, request, context)
        }
    } else if ('detail' in request) {
        if ('eventBridge' in definition) {
            return handleEventBridgeEvent(definition, request, context)
        }
    } else if ('SecretId' in request && 'Step' in request) {
        if ('secretRotation' in definition) {
            return handleSecretRotationEvent(definition, request, context)
        }
    } else if ('Records' in request) {
        const unprocessable: unknown[] = []
        const snsRecords: SNSEventRecord[] = []
        const kinesisRecords: KinesisStreamRecord[] = []
        const sqsRecords: SQSRecord[] = []
        for (const record of request.Records) {
            if ('Sns' in record) {
                snsRecords.push(record)
            } else if ('messageAttributes' in record) {
                sqsRecords.push(record)
            } else if ('kinesis' in record) {
                kinesisRecords.push(record)
            } else {
                unprocessable.push(record)
            }
        }

        if (sqsRecords.length > 0 && sqsRecords.length === request.Records.length) {
            if ('sqs' in definition) {
                return handleSqsEvent(definition, sqsRecords, context)
            }
        } else if (snsRecords.length > 0 && snsRecords.length === request.Records.length) {
            if ('sns' in definition) {
                return handleSnsEvent(definition, snsRecords, context)
            }
        } else if (kinesisRecords.length > 0 && kinesisRecords.length === request.Records.length) {
            if ('kinesis' in definition) {
                return handleKinesisEvent(definition, kinesisRecords, context)
            }
        }
    } else if ('records' in request) {
        const unprocessable: unknown[] = []
        const firehoseRecords: FirehoseTransformationEventRecord[] = []
        for (const record of request.records) {
            if ('recordId' in record) {
                firehoseRecords.push(record)
            } else {
                unprocessable.push(record)
            }
        }
        if (firehoseRecords.length > 0 && firehoseRecords.length === request.records.length) {
            if ('firehose' in definition) {
                return handleFirehoseTransformation(definition, firehoseRecords, context)
            }
        }
    }

    return handleRawEvent(definition, request, context)
}

export function eventHandler<H extends EventHandler>(definition: H): AWSLambdaHandler {
    const config = isFunction(definition.config) ? Promise.resolve(definition.config()) : definition.config
    async function handler(request: RawRequest, context: Context): Promise<RawResponse> {
        const services = isFunction(definition.services) ? definition.services((await config) as never) : definition.services

        const lambdaContext: LambdaContext = {
            logger: globalLogger,
            metrics: globalMetrics,
            tracer: globalTracer,
            isSensitive: definition.isSensitive ?? false,
            raw: context,
            services: (await services) as never,
            config: (await config) as never,
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
    return handler as AWSLambdaHandler
}

export function firehoseHandler<C, S, FirehoseP, FirehoseR, D>(
    definition: D & FirehoseTransformationHandler<C, S, FirehoseP, FirehoseR>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function eventBridgeHandler<C, S, EbP, EbR, D>(definition: D & EventBridgeHandler<C, S, EbP, EbR>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function httpHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV extends GatewayVersion, D>(
    definition: D & HttpHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function kinesisHandler<C, S, KinesisP, KinesisR, D>(
    definition: D & KinesisHandler<C, S, KinesisP, KinesisR>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function rawHandler<C, S, RawP, RawR, D>(definition: D & RawHandler<C, S, RawP, RawR>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function snsHandler<C, S, SnsP, D>(definition: D & SnsHandler<C, S, SnsP>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function secretRotationHandler<C extends {}, S extends SecretRotationServices, D>(
    definition: D & SecretRotationHandler<C, S>
): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}

export function sqsHandler<C, S, SqsP, D>(definition: D & SQSHandler<C, S, SqsP>): AWSLambdaHandler & D {
    return eventHandler(definition as unknown as EventHandler) as AWSLambdaHandler & D
}
