import type { AWSLambdaHandler, RawRequest, RawResponse } from './aws'
import type { EventHandler } from './types'

import { handleEventBridgeEvent } from '../events/eventbridge/handler'
import { handleFirehoseTransformation } from '../events/firehose/handler'
import { handleHttpEvent } from '../events/http/handler'
import { handleKinesisEvent } from '../events/kinesis/handler'
import { handleRawEvent } from '../events/raw/handler'
import { handleS3Batch } from '../events/s3-batch/handler'
import { handleSecretRotationEvent } from '../events/secret-rotation/handler'
import { handleSnsEvent } from '../events/sns/handler'
import { handleSqsEvent } from '../events/sqs/handler'
import type { LambdaContext } from '../events/types'
import { errorHandler } from '../functions/common/error-handler'
import { loggerContext } from '../functions/common/logger-context'
import { metricsContext } from '../functions/common/metrics-context'
import { traceInvocation } from '../functions/common/trace-invocation'
import { warmup } from '../functions/common/warmup'
import { logger as globalLogger } from '../observability/logger/logger'
import { metrics as globalMetrics } from '../observability/metrics/metrics'
import { tracer as globalTracer } from '../observability/tracer/tracer'

import { isFunction } from '@skyleague/axioms'
import type { Context, SNSEventRecord, KinesisStreamRecord, FirehoseTransformationEventRecord, SQSRecord } from 'aws-lambda'

export async function handleEvent(definition: EventHandler, request: RawRequest, context: LambdaContext) {
    if ('headers' in request) {
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
    } else if ('results' in request) {
        if ('s3Batch' in definition) {
            return handleS3Batch(definition, request, context)
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
