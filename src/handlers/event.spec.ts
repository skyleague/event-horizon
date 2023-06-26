/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { LambdaHandler } from './aws.js'
import { createLambdaContext, eventHandler, handleEvent } from './event.js'
import {
    eventBridgeHandler,
    firehoseHandler,
    httpHandler,
    kinesisHandler,
    rawHandler,
    s3BatchHandler,
    s3Handler,
    secretRotationHandler,
    snsHandler,
    sqsHandler,
} from './handlers.js'
import type { EventHandler } from './types.js'

import { EventError } from '../errors/index.js'
import { logger } from '../observability/logger/logger.js'

import 'aws-sdk-client-mock-jest'
import {
    AppConfigData,
    AppConfigDataClient,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
} from '@aws-sdk/client-appconfigdata'
import type { SecretsManager } from '@aws-sdk/client-secrets-manager'
import {
    alpha,
    asyncForAll,
    constant,
    dict,
    failure,
    forAll,
    json,
    oneOf,
    random,
    sleep,
    string,
    tuple,
    unknown,
} from '@skyleague/axioms'
import {
    eventBridgeEvent,
    FirehoseTransformationEvent,
    httpEvent,
    KinesisStreamEvent,
    S3BatchEvent,
    S3Event,
    secretRotationEvent,
    SNSEvent,
    SQSEvent,
} from '@skyleague/event-horizon-dev'
import { context, mockLogger, mockMetrics, mockTracer } from '@skyleague/event-horizon-dev/test'
import { arbitrary } from '@skyleague/therefore'
import type { SNSEvent as LambdaSnsEvent } from 'aws-lambda'
import { mockClient } from 'aws-sdk-client-mock'
import { expect, describe, it, vi } from 'vitest'

describe('handleEvent', () => {
    const method = random(oneOf(constant('get'), constant('put')))
    const path = `/${random(alpha())}` as const

    it('http', async () => {
        const handler = httpHandler({
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: vi.fn(),
            },
        })
        const http = vi.fn()
        await asyncForAll(tuple(httpEvent(handler), unknown(), await context()), async ([event, ret, ctx]) => {
            http.mockClear()
            http.mockReturnValue(ret as any)

            expect(await handleEvent({ definition: handler, request: event.raw, context: ctx, handlers: { http } })).toBe(ret)

            expect(http).toHaveBeenCalledWith(handler, event.raw, ctx)
        })
    })

    it('eventBridge', async () => {
        const handler = eventBridgeHandler({ eventBridge: { schema: {}, handler: vi.fn() } })
        const eventBridge = vi.fn()
        await asyncForAll(tuple(eventBridgeEvent(handler), unknown(), await context()), async ([event, ret, ctx]) => {
            eventBridge.mockClear()
            eventBridge.mockReturnValue(ret as any)

            expect(await handleEvent({ definition: handler, request: event.raw, context: ctx, handlers: { eventBridge } })).toBe(
                ret
            )

            expect(eventBridge).toHaveBeenCalledWith(handler, event.raw, ctx)
        })
    })

    it('secretRotation', async () => {
        const services = { secretsManager: vi.fn() as unknown as SecretsManager }
        const handler = secretRotationHandler({
            services,
            secretRotation: { handler: vi.fn() },
        })
        const secretRotation = vi.fn()
        await asyncForAll(tuple(secretRotationEvent(), unknown(), await context()), async ([event, ret, ctx]) => {
            secretRotation.mockClear()
            secretRotation.mockReturnValue(ret as any)

            expect(
                await handleEvent({
                    definition: handler as any,
                    request: event.raw,
                    context: ctx,
                    handlers: { secretRotation },
                })
            ).toBe(ret)

            expect(secretRotation).toHaveBeenCalledWith(handler, event.raw, ctx)
        })
    })

    it('sqs', async () => {
        const handler = sqsHandler({
            sqs: { handler: vi.fn(), schema: {} },
        })
        const sqs = vi.fn()
        const raw = vi.fn()
        await asyncForAll(tuple(arbitrary(SQSEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            raw.mockClear()
            sqs.mockClear()
            sqs.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: { sqs, raw },
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(sqs).toHaveBeenCalledWith(handler, event.Records, ctx)
                expect(raw).not.toHaveBeenCalled()
            } else {
                expect(response).toBe(undefined)
                expect(sqs).not.toHaveBeenCalled()
                expect(raw).toHaveBeenCalledWith(handler, { Records: [] }, ctx)
            }
        })
    })

    it('sns', async () => {
        const handler = snsHandler({
            sns: { handler: vi.fn(), schema: {} },
        })
        const raw = vi.fn()
        const sns = vi.fn()
        await asyncForAll(
            tuple(arbitrary(SNSEvent), unknown(), await context()),
            async ([event, ret, ctx]) => {
                raw.mockClear()
                sns.mockClear()
                sns.mockReturnValue(ret as any)

                const response = await handleEvent({
                    definition: handler as any,
                    request: event as LambdaSnsEvent,
                    context: ctx,
                    handlers: { sns },
                })
                if (event.Records.length > 0) {
                    expect(response).toBe(ret)
                    expect(sns).toHaveBeenCalledWith(handler, event.Records, ctx)
                    expect(raw).not.toHaveBeenCalled()
                } else {
                    expect(response).toBe(undefined)
                    expect(raw).toHaveBeenCalledWith(handler, { Records: [] }, ctx)
                    expect(sns).not.toHaveBeenCalled()
                }
            },
            {
                counterExample: [
                    {
                        Records: [
                            {
                                EventVersion: '',
                                EventSubscriptionArn: '',
                                EventSource: '',
                                Sns: {
                                    SignatureVersion: '',
                                    Timestamp: '',
                                    Signature: '',
                                    SigningCertUrl: '',
                                    MessageId: '',
                                    Message: '',
                                    MessageAttributes: {},
                                    Type: '',
                                    UnsubscribeUrl: '',
                                    TopicArn: '',
                                    Subject: '',
                                    Token: '',
                                },
                            },
                        ],
                    },
                    0,
                    random(await context()),
                ],
            }
        )
    })

    it('kinesis', async () => {
        const handler = kinesisHandler({
            kinesis: { handler: vi.fn(), schema: {} },
        })
        const kinesis = vi.fn()
        const raw = vi.fn()
        await asyncForAll(tuple(arbitrary(KinesisStreamEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            raw.mockClear()
            kinesis.mockClear()
            kinesis.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: { raw, kinesis },
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(kinesis).toHaveBeenCalledWith(handler, event.Records, ctx)
                expect(raw).not.toHaveBeenCalled()
            } else {
                expect(response).toBe(undefined)
                expect(raw).toHaveBeenCalledWith(handler, { Records: [] }, ctx)
                expect(kinesis).not.toHaveBeenCalled()
            }
        })
    })

    it('s3', async () => {
        const handler = s3Handler({
            s3: { handler: vi.fn() },
        })
        const s3 = vi.fn()
        const raw = vi.fn()
        await asyncForAll(tuple(arbitrary(S3Event), unknown(), await context()), async ([event, ret, ctx]) => {
            raw.mockClear()
            s3.mockClear()
            s3.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: { s3, raw },
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(raw).not.toHaveBeenCalled()
                expect(s3).toHaveBeenCalledWith(handler, event.Records, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(s3).not.toHaveBeenCalled()
                expect(raw).toHaveBeenCalledWith(handler, { Records: [] }, ctx)
            }
        })
    })

    it('firehose', async () => {
        const handler = firehoseHandler({
            firehose: { handler: vi.fn(), schema: {} },
        })
        const firehose = vi.fn()
        const raw = vi.fn()
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), unknown(), await context()),
            async ([event, ret, ctx]) => {
                raw.mockClear()
                firehose.mockClear()
                firehose.mockReturnValue(ret as any)

                const response = await handleEvent({
                    definition: handler as any,
                    request: event,
                    context: ctx,
                    handlers: { firehose, raw },
                })
                if (event.records.length > 0) {
                    expect(response).toBe(ret)
                    expect(raw).not.toHaveBeenCalled()
                    expect(firehose).toHaveBeenCalledWith(handler, event.records, ctx)
                } else {
                    expect(response).toBe(undefined)
                    expect(raw).toHaveBeenCalledWith(handler, event, ctx)
                    expect(firehose).not.toHaveBeenCalled()
                }
            }
        )
    })

    it('s3Batch', async () => {
        const handler = s3BatchHandler({
            s3Batch: { handler: vi.fn(), schema: {} },
        })
        const s3Batch = vi.fn()
        await asyncForAll(tuple(arbitrary(S3BatchEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            s3Batch.mockClear()
            s3Batch.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: { s3Batch },
            })
            if (event.tasks.length > 0) {
                expect(response).toBe(ret)
                expect(s3Batch).toHaveBeenCalledWith(handler, event, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(s3Batch).not.toHaveBeenCalled()
            }
        })
    })

    it.each([{ Records: [{ foo: 'bar' }] }, { records: [{ foo: 'bar' }] }])('unprocessable $event', async (event) => {
        const handler = rawHandler({
            raw: { handler: vi.fn(), schema: {} },
        })
        const raw = vi.fn()
        await asyncForAll(tuple(unknown(), await context()), async ([ret, ctx]) => {
            raw.mockClear()
            raw.mockReturnValue(ret as any)

            const records = event.records ?? event.Records

            const response = await handleEvent({
                definition: handler as any,
                request: event as any,
                context: ctx,
                handlers: { raw },
            })
            // @todo: is this what we want?
            if (records.length > 0) {
                expect(response).toBe(ret)
                expect(raw).toHaveBeenCalledWith(handler, event, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(raw).not.toHaveBeenCalled()
            }
        })
    })

    it('raw', async () => {
        const handler = rawHandler({ raw: { schema: {}, handler: vi.fn() } })
        const raw = vi.fn()
        await asyncForAll(tuple(unknown(), unknown(), await context()), async ([event, ret, ctx]) => {
            raw.mockClear()
            raw.mockReturnValue(ret as any)

            expect(await handleEvent({ definition: handler, request: event as any, context: ctx, handlers: { raw } })).toBe(ret)

            expect(raw).toHaveBeenCalledWith(handler, event, ctx)
        })
    })
})

describe('createLambdaContext', () => {
    it('set manual observability', async () => {
        await asyncForAll(await context(), async (ctx) => {
            const l = mockLogger()
            const m = mockMetrics()
            const t = mockTracer()
            const lCtx = await createLambdaContext({
                definition: { raw: { handler: vi.fn(), schema: {} } },
                context: ctx.raw,
                services: undefined,
                config: undefined,
                traceId: undefined,
                requestId: undefined,
                logger: l,
                metrics: m,
                tracer: t,
            })
            expect(lCtx.logger).toBe(l)
            expect(lCtx.metrics).toBe(m)
            expect(lCtx.tracer).toBe(t)
            expect(lCtx.raw).toBe(ctx.raw)
            expect(lCtx.isSensitive).toBe(false)
            expect(lCtx.traceId).toContain('-')
            expect(lCtx.requestId).toContain('-')
            expect(lCtx.services).toBe(undefined)
            expect(lCtx.config).toBe(undefined)
        })
    })

    it('set trace and request', async () => {
        await asyncForAll(tuple(await context(), string(), string()), async ([ctx, traceId, requestId]) => {
            const l = mockLogger()
            const m = mockMetrics()
            const t = mockTracer()
            const lCtx = await createLambdaContext({
                definition: { raw: { handler: vi.fn(), schema: {} } },
                context: ctx.raw,
                services: undefined,
                config: undefined,
                traceId,
                requestId,
                logger: l,
                metrics: m,
                tracer: t,
            })
            expect(lCtx.logger).toBe(l)
            expect(lCtx.metrics).toBe(m)
            expect(lCtx.tracer).toBe(t)
            expect(lCtx.raw).toBe(ctx.raw)
            expect(lCtx.isSensitive).toBe(false)
            expect(lCtx.traceId).toEqual(traceId)
            expect(lCtx.requestId).toEqual(requestId)
            expect(lCtx.services).toBe(undefined)
            expect(lCtx.config).toBe(undefined)
        })
    })

    it('set trace and request from unknown generator', async () => {
        await asyncForAll(
            tuple(await context(), string({ minLength: 4 }), string({ minLength: 4 })),
            async ([ctx, traceId, requestId]) => {
                const l = mockLogger()
                const m = mockMetrics()
                const t = mockTracer()
                const lCtx = await createLambdaContext({
                    definition: { raw: { handler: vi.fn(), schema: {} } },
                    context: ctx.raw,
                    services: undefined,
                    config: undefined,
                    traceId: undefined,
                    requestId: undefined,
                    traceIdGenerator: traceId,
                    requestIdGenerator: requestId,
                    logger: l,
                    metrics: m,
                    tracer: t,
                })
                expect(lCtx.logger).toBe(l)
                expect(lCtx.metrics).toBe(m)
                expect(lCtx.tracer).toBe(t)
                expect(lCtx.raw).toBe(ctx.raw)
                expect(lCtx.isSensitive).toBe(false)
                expect(lCtx.traceId).toContain('-')
                expect(lCtx.requestId).toContain('-')
                expect(lCtx.services).toBe(undefined)
                expect(lCtx.config).toBe(undefined)
            }
        )
    })
})

describe('eventHandler', () => {
    const tracerInstanceMock = () => ({
        isTracingEnabled: vi.fn().mockReturnValue(true),
        getSegment: vi.fn(),
        setSegment: vi.fn(),
        putMetadata: vi.fn(),
        annotateColdStart: vi.fn(),
        addServiceNameAnnotation: vi.fn(),
        addErrorAsMetadata: vi.fn(),
        addResponseAsMetadata: vi.fn(),
    })

    const appConfigDataMock = mockClient(AppConfigDataClient)

    it('handler is definition', () => {
        forAll(dict(unknown()), (meta) => {
            const handler = eventHandler({
                raw: { schema: {}, handler: vi.fn() },
                ...meta,
            })
            expect(handler).toEqual(expect.objectContaining(meta))
        })
    })

    it('eager init calls config and services, sync', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = vi.fn().mockReturnValue(c)
            const services = vi.fn().mockReturnValue(s)
            eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                },
                { eagerHandlerInitialization: true }
            )
            // force event loop switching
            await sleep(10)
            expect(config).toHaveBeenCalledTimes(1)
            expect(config).toHaveBeenCalledWith()
            expect(services).toHaveBeenCalledTimes(1)
            expect(services).toHaveBeenCalledWith(c)
        })
    })

    it('eager init calls config and services, async', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = vi.fn().mockResolvedValue(c)
            const services = vi.fn().mockResolvedValue(s)
            eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                },
                { eagerHandlerInitialization: true }
            )
            // force event loop switching
            await sleep(10)
            expect(config).toHaveBeenCalledTimes(1)
            expect(config).toHaveBeenCalledWith()
            expect(services).toHaveBeenCalledTimes(1)
            expect(services).toHaveBeenCalledWith(c)
        })
    })

    it('lazy init calls not config and not services, async', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = vi.fn().mockResolvedValue(c)
            const services = vi.fn().mockResolvedValue(s)
            eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                },
                { eagerHandlerInitialization: false }
            )
            // force event loop switching
            await sleep(10)
            expect(config).not.toHaveBeenCalled()
            expect(services).not.toHaveBeenCalled()
        })
    })

    it('default init calls not config and not services, async', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = vi.fn().mockResolvedValue(c)
            const services = vi.fn().mockResolvedValue(s)
            eventHandler({
                config,
                services,
                raw: { schema: {}, handler: vi.fn() },
            })
            // force event loop switching
            await sleep(10)
            expect(config).not.toHaveBeenCalled()
            expect(services).not.toHaveBeenCalled()
        })
    })

    it('default init calls with literals', () => {
        forAll(tuple(unknown(), unknown()), ([c, s]) => {
            eventHandler({
                config: c as never,
                services: s as never,
                raw: { schema: {}, handler: vi.fn() },
            })
        })
    })

    it('early exit fully resolved on warmer', async () => {
        const warmer = '__WARMER__'
        await asyncForAll(tuple(unknown(), unknown(), await context()), async ([c, s, ctx]) => {
            const handlerImpl = vi.fn()
            const config = vi.fn().mockResolvedValue(c)
            const services = vi.fn().mockResolvedValue(s)
            const handler = eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                },
                { eventHandler: handlerImpl }
            ) as LambdaHandler

            expect(await handler(warmer, ctx.raw)).toBe(undefined)
            expect(config).toHaveBeenCalledTimes(1)
            expect(config).toHaveBeenCalledWith()
            expect(services).toHaveBeenCalledTimes(1)
            expect(services).toHaveBeenCalledWith(c)

            expect(handlerImpl).not.toHaveBeenCalled()
        })
    })

    it('configuration is loaded into profile successfully', async () => {
        const appConfigData = new AppConfigData({})
        const s = { appConfigData }
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), await context(), string(), dict(json())),
            async ([request, c, ret, ctx, token, profile]) => {
                vi.clearAllMocks()
                appConfigDataMock.reset()
                appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
                appConfigDataMock
                    .on(GetLatestConfigurationCommand)
                    .resolvesOnce({ Configuration: JSON.stringify(profile) as any })

                const setbinding = vi.spyOn(ctx.logger, 'setBindings')

                const getSegmentVal = {
                    addNewSubsegment: vi.fn(),
                    close: vi.fn(),
                }
                ;(ctx.metrics.instance as unknown as { storedMetrics: any }).storedMetrics.foo = true
                vi.spyOn(ctx.metrics.instance, 'publishStoredMetrics').mockImplementation(() => {
                    //
                })
                vi.spyOn(ctx.metrics.instance, 'captureColdStartMetric')

                const tracerInstance = tracerInstanceMock()
                tracerInstance.getSegment.mockReturnValue(getSegmentVal)
                ctx.tracer.instance = tracerInstance as any

                const handlerImpl = vi.fn().mockResolvedValue(ret)
                const config = vi.fn().mockResolvedValue(c)
                const services = vi.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                    profile: { schema: { schema: { type: 'object' }, is: () => true } },
                    logger: ctx.logger,
                    metrics: ctx.metrics,
                    tracer: ctx.tracer,
                }
                const handler = eventHandler(definition as unknown as EventHandler, {
                    eventHandler: handlerImpl,
                }) as LambdaHandler

                expect(await handler(request, ctx.raw)).toBe(ret)
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith({
                    definition,
                    request,
                    context: expect.objectContaining({ raw: ctx.raw }),
                })

                const rCtx = handlerImpl.mock.calls[0][0].context
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(rCtx.profile).toEqual(profile)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
            },
            { counterExample: [null, 0, 0, random(await context()), '+2', {}] }
        )
    })

    it('invalidating configuration is loaded into profile as failure', async () => {
        const appConfigData = new AppConfigData({})
        const s = { appConfigData }
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), await context(), string(), dict(json())),
            async ([request, c, ret, ctx, token, profile]) => {
                vi.clearAllMocks()

                appConfigDataMock.reset()
                appConfigDataMock.on(StartConfigurationSessionCommand).resolvesOnce({ InitialConfigurationToken: token })
                appConfigDataMock
                    .on(GetLatestConfigurationCommand)
                    .resolvesOnce({ Configuration: JSON.stringify(profile) as any })

                const getSegmentVal = {
                    addNewSubsegment: vi.fn(),
                    close: vi.fn(),
                }
                ;(ctx.metrics.instance as unknown as { storedMetrics: any }).storedMetrics.foo = true
                vi.spyOn(ctx.metrics.instance, 'publishStoredMetrics').mockImplementation(() => {
                    //
                })
                vi.spyOn(ctx.metrics.instance, 'captureColdStartMetric')

                const tracerInstance = tracerInstanceMock()
                ctx.tracer.instance = tracerInstance as any
                tracerInstance.getSegment.mockReturnValue(getSegmentVal)

                const handlerImpl = vi.fn().mockResolvedValue(ret)
                const config = vi.fn().mockResolvedValue(c)
                const services = vi.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                    profile: { schema: { schema: { type: 'object' }, is: () => false } },
                    logger: ctx.logger,
                    metrics: ctx.metrics,
                    tracer: ctx.tracer,
                }
                const handler = eventHandler(definition as unknown as EventHandler, {
                    eventHandler: handlerImpl,
                }) as LambdaHandler

                await expect(() => handler(request, ctx.raw)).rejects.toThrowError(expect.any(EventError))
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).not.toHaveBeenCalled()
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
            }
        )
    })

    it('success resolves to success', async () => {
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), unknown(), await context()),
            async ([request, c, s, ret, ctx]) => {
                const setbinding = vi.spyOn(ctx.logger, 'setBindings')

                const getSegmentVal = {
                    addNewSubsegment: vi.fn(),
                    close: vi.fn(),
                }
                ;(ctx.metrics.instance as unknown as { storedMetrics: any }).storedMetrics.foo = true
                vi.spyOn(ctx.metrics.instance, 'publishStoredMetrics').mockImplementation(() => {
                    //
                })
                vi.spyOn(ctx.metrics.instance, 'captureColdStartMetric')

                const tracerInstance = tracerInstanceMock()
                ctx.tracer.instance = tracerInstance as any
                tracerInstance.getSegment.mockReturnValue(getSegmentVal)

                const handlerImpl = vi.fn().mockResolvedValue(ret)
                const config = vi.fn().mockResolvedValue(c)
                const services = vi.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                    logger: ctx.logger,
                    metrics: ctx.metrics,
                    tracer: ctx.tracer,
                }
                const handler = eventHandler(definition, {
                    eventHandler: handlerImpl,
                }) as LambdaHandler

                expect(await handler(request, ctx.raw)).toBe(ret)
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith({
                    definition,
                    request,
                    context: expect.objectContaining({ raw: ctx.raw }),
                })

                const rCtx = handlerImpl.mock.calls[0][0].context
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
            }
        )
    })

    it('failure resolves to failure', async () => {
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), unknown().map(failure), await context()),
            async ([request, c, s, ret, ctx]) => {
                const setbinding = vi.spyOn(ctx.logger, 'setBindings')
                ;(ctx.metrics.instance as unknown as { storedMetrics: any }).storedMetrics.foo = true
                vi.spyOn(ctx.metrics.instance, 'publishStoredMetrics').mockImplementation(() => {
                    //
                })
                vi.spyOn(ctx.metrics.instance, 'captureColdStartMetric')

                const tracerInstance = tracerInstanceMock()
                ctx.tracer.instance = tracerInstance as any

                const getSegment = {
                    addNewSubsegment: vi.fn(),
                    close: vi.fn(),
                }
                ;(ctx.tracer.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(ctx.tracer.instance.getSegment as any).mockReturnValue(getSegment)

                const handlerImpl = vi.fn().mockResolvedValue(ret)
                const config = vi.fn().mockResolvedValue(c)
                const services = vi.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                    logger: ctx.logger,
                    metrics: ctx.metrics,
                    tracer: ctx.tracer,
                }
                const handler = eventHandler(definition, {
                    eventHandler: handlerImpl,
                }) as LambdaHandler

                await expect(() => handler(request, ctx.raw)).rejects.toEqual(ret)
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith({
                    definition,
                    request,
                    context: expect.objectContaining({ raw: ctx.raw }),
                })

                const rCtx = handlerImpl.mock.calls[0][0].context
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegment.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegment.close).toHaveBeenCalled()
            }
        )
    })

    it('graceful failure resolves to success', async () => {
        await asyncForAll(
            tuple(
                unknown(),
                unknown(),
                unknown(),
                string().map((f) => new EventError(f, { errorHandling: 'graceful' })),
                await context()
            ),
            async ([request, c, s, ret, ctx]) => {
                const setbinding = vi.spyOn(ctx.logger, 'setBindings')

                const getSegmentVal = {
                    addNewSubsegment: vi.fn(),
                    close: vi.fn(),
                }
                ;(ctx.metrics.instance as unknown as { storedMetrics: any }).storedMetrics.foo = true
                vi.spyOn(ctx.metrics.instance, 'publishStoredMetrics').mockImplementation(() => {
                    //
                })
                vi.spyOn(ctx.metrics.instance, 'captureColdStartMetric')

                const tracerInstance = tracerInstanceMock()
                ctx.tracer.instance = tracerInstance as any
                tracerInstance.getSegment.mockReturnValue(getSegmentVal)

                const handlerImpl = vi.fn().mockResolvedValue(ret)
                const config = vi.fn().mockResolvedValue(c)
                const services = vi.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: vi.fn() },
                    logger: ctx.logger,
                    metrics: ctx.metrics,
                    tracer: ctx.tracer,
                }
                const handler = eventHandler(definition, {
                    eventHandler: handlerImpl,
                }) as LambdaHandler

                expect(await handler(request, ctx.raw)).toEqual({})
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith({
                    definition,
                    request,
                    context: expect.objectContaining({ raw: ctx.raw }),
                })

                const rCtx = handlerImpl.mock.calls[0][0].context
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
            }
        )
    })
})
