import type { AWSLambdaHandler, RawRequest, RawResponse } from './aws'
import type { EventHandler } from './types'

import { constants } from '../constants'
import type { EventError } from '../errors'
import { errorHandler } from '../events/common/error-handler'
import { loggerContext } from '../events/common/logger-context'
import { metricsContext } from '../events/common/metrics-context'
import { profileHandler } from '../events/common/profile-handler'
import { traceInvocation } from '../events/common/trace-invocation'
import { warmup } from '../events/common/warmup'
import { handleEventBridgeEvent } from '../events/eventbridge/handler'
import { handleFirehoseTransformation } from '../events/firehose/handler'
import { handleHTTPEvent } from '../events/http/handler'
import { handleKinesisEvent } from '../events/kinesis/handler'
import { handleRawEvent } from '../events/raw/handler'
import { handleS3Batch } from '../events/s3-batch/handler'
import { handleS3Event } from '../events/s3/handler'
import { handleSecretRotationEvent } from '../events/secret-rotation/handler'
import type { SecretRotationHandler } from '../events/secret-rotation/types'
import { handleSNSEvent } from '../events/sns/handler'
import { handleSQSEvent } from '../events/sqs/handler'
import type { LambdaContext } from '../events/types'
import type { Logger } from '../observability/logger/logger'
import { logger as globalLogger } from '../observability/logger/logger'
import type { Metrics } from '../observability/metrics/metrics'
import { metrics as globalMetrics } from '../observability/metrics/metrics'
import type { Tracer } from '../observability/tracer/tracer'
import { tracer as globalTracer } from '../observability/tracer/tracer'

import type { Try } from '@skyleague/axioms'
import { isFunction, mapTry, memoize, transformTry, tryToError } from '@skyleague/axioms'
import type {
    Context,
    FirehoseTransformationEventRecord,
    KinesisStreamRecord,
    S3EventRecord,
    SNSEventRecord,
    SQSRecord,
} from 'aws-lambda'
import AWSXRay from 'aws-xray-sdk-core'

import { randomUUID } from 'crypto'

export const allHandlers = {
    http: handleHTTPEvent,
    eventBridge: handleEventBridgeEvent,
    secretRotation: handleSecretRotationEvent,
    sqs: handleSQSEvent,
    sns: handleSNSEvent,
    kinesis: handleKinesisEvent,
    s3: handleS3Event,
    firehose: handleFirehoseTransformation,
    s3Batch: handleS3Batch,
    raw: handleRawEvent,
}

export async function handleEvent({
    definition,
    request,
    context,
    handlers = allHandlers,
}: {
    definition: EventHandler
    request: RawRequest | null | undefined
    context: LambdaContext
    handlers?: typeof allHandlers
}): Promise<Try<unknown>> {
    if (typeof request === 'object' && request !== null) {
        if ('headers' in request) {
            if ('http' in definition) {
                return handlers.http(definition, request, context)
            }
        } else if ('detail' in request) {
            if ('eventBridge' in definition) {
                return handlers.eventBridge(definition, request, context)
            }
        } else if ('SecretId' in request && 'Step' in request) {
            if ('secretRotation' in definition) {
                return handlers.secretRotation(definition as SecretRotationHandler, request, context)
            }
        } else if ('Records' in request) {
            if (request.Records.length === 0) {
                return
            }

            const unprocessable: unknown[] = []
            const snsRecords: SNSEventRecord[] = []
            const kinesisRecords: KinesisStreamRecord[] = []
            const sqsRecords: SQSRecord[] = []
            const s3Records: S3EventRecord[] = []
            for (const record of request.Records) {
                if ('Sns' in record) {
                    snsRecords.push(record)
                } else if ('messageAttributes' in record) {
                    sqsRecords.push(record)
                } else if ('kinesis' in record) {
                    kinesisRecords.push(record)
                } else if ('s3' in record) {
                    s3Records.push(record)
                } else {
                    unprocessable.push(record)
                }
            }

            if (sqsRecords.length > 0 && sqsRecords.length === request.Records.length) {
                if ('sqs' in definition) {
                    return handlers.sqs(definition, sqsRecords, context)
                }
            } else if (snsRecords.length > 0 && snsRecords.length === request.Records.length) {
                if ('sns' in definition) {
                    return handlers.sns(definition, snsRecords, context)
                }
            } else if (kinesisRecords.length > 0 && kinesisRecords.length === request.Records.length) {
                if ('kinesis' in definition) {
                    return handlers.kinesis(definition, kinesisRecords, context)
                }
            } else if (s3Records.length > 0 && s3Records.length === request.Records.length) {
                if ('s3' in definition) {
                    return handlers.s3(definition, s3Records, context)
                }
            }
        } else if ('records' in request) {
            if (request.records.length === 0) {
                return
            }

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
                    return handlers.firehose(definition, firehoseRecords, context)
                }
            }
        } else if ('tasks' in request) {
            if (request.tasks.length === 0) {
                return
            }

            if ('s3Batch' in definition) {
                return handlers.s3Batch(definition, request, context)
            }
        }
    }

    return handlers.raw(definition, request, context)
}

export async function createLambdaContext({
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
    definition: EventHandler
    context: Context
    services: Promise<never | undefined> | undefined
    config: Promise<never> | undefined
    traceId: string | undefined
    requestId: string | undefined
    traceIdGenerator?: string
    requestIdGenerator?: string
    logger?: Logger | undefined
    metrics?: Metrics | undefined
    tracer?: Tracer | undefined
}): Promise<LambdaContext> {
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

export interface EventHandlerOptions<R> {
    traceId?: (request: R) => string | undefined
    requestId?: (request: R) => string | undefined
    eventHandler?: typeof handleEvent
    eagerHandlerInitialization?: boolean
    logger?: Logger
    metrics?: Metrics
    tracer?: Tracer
}

AWSXRay.setContextMissingStrategy(() => {
    // do not log errors on the cold start
})

export function eventHandler<H extends EventHandler, R>(definition: H, options: EventHandlerOptions<R> = {}): AWSLambdaHandler {
    const {
        eventHandler: eventHandlerImpl = handleEvent,
        eagerHandlerInitialization = constants.eagerHandlerInitialization,
        logger,
        metrics,
        tracer,
    } = options
    const config = memoize(() => (isFunction(definition.config) ? definition.config() : definition.config))
    const services = memoize(() =>
        isFunction(definition.services)
            ? Promise.resolve(config()).then((c) => definition.services?.(c as never))
            : definition.services
    )
    if (eagerHandlerInitialization) {
        void services()
    }

    const warmupFn = warmup()
    const profileFn = profileHandler(definition as never, services as never)

    async function handler(request: RawRequest, context: Context): Promise<RawResponse> {
        const lambdaContext: LambdaContext = await createLambdaContext({
            definition,
            context,
            services: services(),
            config: config(),
            requestId: options.requestId?.(request as R),
            traceId: options.traceId?.(request as R),
            logger,
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
            // isolate the context logger
            c.logger = c.logger.child()
            c.profile = (await profileFn.before()) as never
            return c
        })

        const tryResponse = await mapTry(ctx, (c) =>
            eventHandlerImpl({ definition: definition as unknown as EventHandler, request, context: c })
        )

        const response = transformTry(
            tryResponse,
            (s) => {
                metricsFn.after()
                tracerFn.after(s)

                return s
            },
            (f) => {
                for (const eh of [errorHandlerFn.onError, tracerFn.onError, metricsFn.onError]) {
                    f = (eh(f) as EventError | undefined) ?? f
                }
                return errorHandlerFn.onExit(f)
            }
        )

        return tryToError(response)
    }
    Object.assign(handler, definition)
    return handler as AWSLambdaHandler
}
