import type { AWSLambdaHandler, RawRequest, RawResponse } from './aws.js'
import type { EventHandler } from './types.js'

import { constants } from '../constants.js'
import type { EventError } from '../errors/index.js'
import { errorHandler } from '../events/common/error-handler.js'
import { loggerContext } from '../events/common/logger-context.js'
import { metricsContext } from '../events/common/metrics-context.js'
import { profileHandler } from '../events/common/profile-handler.js'
import { traceInvocation } from '../events/common/trace-invocation.js'
import { traceServices } from '../events/common/trace-services.js'
import { warmup } from '../events/common/warmup.js'
import { handleEventBridgeEvent } from '../events/eventbridge/handler.js'
import { handleFirehoseTransformation } from '../events/firehose/handler.js'
import { handleHTTPEvent } from '../events/http/handler.js'
import { handleKinesisEvent } from '../events/kinesis/handler.js'
import { handleRawEvent } from '../events/raw/handler.js'
import { handleS3Event } from '../events/s3/handler.js'
import { handleS3Batch } from '../events/s3-batch/handler.js'
import { handleSecretRotationEvent } from '../events/secret-rotation/handler.js'
import type { SecretRotationHandler } from '../events/secret-rotation/types.js'
import { handleSNSEvent } from '../events/sns/handler.js'
import { handleSQSEvent } from '../events/sqs/handler.js'
import type { LambdaContext } from '../events/types.js'
import type { Logger } from '../observability/logger/logger.js'
import { logger as globalLogger } from '../observability/logger/logger.js'
import type { Metrics } from '../observability/metrics/metrics.js'
import { metrics as globalMetrics } from '../observability/metrics/metrics.js'
import type { Tracer } from '../observability/tracer/tracer.js'
import { tracer as globalTracer } from '../observability/tracer/tracer.js'

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

import { randomUUID } from 'node:crypto'

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

type Handlers = typeof allHandlers

export async function handleEvent({
    definition,
    request,
    context,
    handlers,
}: {
    definition: EventHandler
    request: RawRequest | null | undefined
    context: LambdaContext
    handlers?: Partial<Handlers> | undefined
}): Promise<Try<unknown>> {
    const localHandlers = {
        ...allHandlers,
        ...(handlers ?? {}),
    }

    if (typeof request === 'object' && request !== null) {
        if ('headers' in request) {
            if ('http' in definition) {
                return localHandlers.http(definition, request, context)
            }
        } else if ('detail' in request) {
            if ('eventBridge' in definition) {
                return localHandlers.eventBridge(definition, request, context)
            }
        } else if ('SecretId' in request && 'Step' in request) {
            if ('secretRotation' in definition) {
                return localHandlers.secretRotation(definition as SecretRotationHandler, request, context)
            }
        } else if ('tasks' in request) {
            if (request.tasks.length === 0) {
                return
            }

            if ('s3Batch' in definition) {
                return localHandlers.s3Batch(definition, request, context)
            }
        } else if ('Records' in request || 'records' in request || Array.isArray(request)) {
            const records = 'Records' in request ? request.Records : 'records' in request ? request.records : request
            if (records.length > 0) {
                const unprocessable: unknown[] = []
                const snsRecords: SNSEventRecord[] = []
                const kinesisRecords: KinesisStreamRecord[] = []
                const sqsRecords: SQSRecord[] = []
                const s3Records: S3EventRecord[] = []
                const firehoseRecords: FirehoseTransformationEventRecord[] = []
                for (const record of records) {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (typeof record !== 'object' || record === null || record === undefined) {
                        unprocessable.push(record)
                    } else if ('Sns' in record) {
                        snsRecords.push(record)
                    } else if ('messageAttributes' in record) {
                        sqsRecords.push(record)
                    } else if ('kinesis' in record) {
                        kinesisRecords.push(record)
                    } else if ('s3' in record) {
                        s3Records.push(record)
                    } else if ('recordId' in record) {
                        firehoseRecords.push(record)
                    } else {
                        unprocessable.push(record)
                    }
                }

                if (sqsRecords.length > 0 && sqsRecords.length === records.length) {
                    if ('sqs' in definition) {
                        return localHandlers.sqs(definition, sqsRecords, context)
                    }
                } else if (snsRecords.length > 0 && snsRecords.length === records.length) {
                    if ('sns' in definition) {
                        return localHandlers.sns(definition, snsRecords, context)
                    }
                } else if (kinesisRecords.length > 0 && kinesisRecords.length === records.length) {
                    if ('kinesis' in definition) {
                        return localHandlers.kinesis(definition, kinesisRecords, context)
                    }
                } else if (s3Records.length > 0 && s3Records.length === records.length) {
                    if ('s3' in definition) {
                        return localHandlers.s3(definition, s3Records, context)
                    }
                } else if (firehoseRecords.length > 0 && firehoseRecords.length === records.length) {
                    if ('firehose' in definition) {
                        return localHandlers.firehose(definition, firehoseRecords, context)
                    }
                }
            }
        }
    }

    return localHandlers.raw(definition, request, context)
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
    logger: Logger
    metrics: Metrics
    tracer: Tracer
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

/**
 * @internal
 */
export interface EventHandlerOptions<R> {
    traceId?: (request: R) => string | undefined
    requestId?: (request: R) => string | undefined
    eventHandler?: typeof handleEvent
    eagerHandlerInitialization?: boolean
    handlers?: Partial<Handlers>
}

AWSXRay.setContextMissingStrategy(() => {
    // do not log errors on the cold start
})

export function eventHandler<H extends EventHandler, R>(definition: H, options: EventHandlerOptions<R> = {}): AWSLambdaHandler {
    const {
        eventHandler: eventHandlerImpl = handleEvent,
        eagerHandlerInitialization = constants.eagerHandlerInitialization,
        handlers,
    } = options
    const { logger = globalLogger, metrics = globalMetrics, tracer = globalTracer } = definition

    const traceServicesFn = traceServices({ tracer })

    const config = memoize(() => (isFunction(definition.config) ? definition.config() : definition.config))
    const services = memoize(() =>
        traceServicesFn.before(
            isFunction(definition.services)
                ? Promise.resolve(config()).then((c) => definition.services?.(c as never))
                : definition.services
        )
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

        const tryResponse = await mapTry(ctx, (c) =>
            eventHandlerImpl({ definition: definition as unknown as EventHandler, request, context: c, handlers })
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
