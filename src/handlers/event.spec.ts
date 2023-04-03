/* eslint-disable @typescript-eslint/no-unsafe-call */

import type { LambdaHandler } from './aws.js'
import type { allHandlers } from './event.js'
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
import type { Logger, Metrics, Tracer } from '../observability/index.js'
import { createLogger, logger } from '../observability/logger/logger.js'
import { createMetrics } from '../observability/metrics/metrics.js'
import { createTracer } from '../observability/tracer/tracer.js'

import { AppConfigData } from '@aws-sdk/client-appconfigdata'
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
    context,
    eventBridgeEvent,
    FirehoseTransformationEvent,
    httpEvent,
    KinesisStreamEvent,
    mock,
    S3BatchEvent,
    S3Event,
    secretRotationEvent,
    SNSEvent,
    SQSEvent,
} from '@skyleague/event-horizon-dev'
import { arbitrary } from '@skyleague/therefore'
import type { SNSEvent as LambdaSnsEvent } from 'aws-lambda'

describe('handleEvent', () => {
    const eventHandlers = mock<typeof allHandlers>()

    const method = random(oneOf(constant('get'), constant('put')))
    const path = `/${random(alpha())}` as const

    beforeEach(() => eventHandlers.mockClear())

    test('http', async () => {
        const handler = httpHandler({
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: jest.fn(),
            },
        })
        await asyncForAll(tuple(httpEvent(handler), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.http.mockReturnValue(ret as any)

            expect(await handleEvent({ definition: handler, request: event.raw, context: ctx, handlers: eventHandlers })).toBe(
                ret
            )

            expect(eventHandlers.http).toHaveBeenCalledWith(handler, event.raw, ctx)
        })
    })

    test('eventBridge', async () => {
        const handler = eventBridgeHandler({ eventBridge: { schema: {}, handler: jest.fn() } })
        await asyncForAll(tuple(eventBridgeEvent(handler), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.eventBridge.mockReturnValue(ret as any)

            expect(await handleEvent({ definition: handler, request: event.raw, context: ctx, handlers: eventHandlers })).toBe(
                ret
            )

            expect(eventHandlers.eventBridge).toHaveBeenCalledWith(handler, event.raw, ctx)
        })
    })

    test('secretRotation', async () => {
        const services = { secretsManager: mock<SecretsManager>() as SecretsManager }
        const handler = secretRotationHandler({
            services,
            secretRotation: { handler: jest.fn() },
        })
        await asyncForAll(tuple(secretRotationEvent(), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.secretRotation.mockReturnValue(ret as any)

            expect(
                await handleEvent({ definition: handler as any, request: event.raw, context: ctx, handlers: eventHandlers })
            ).toBe(ret)

            expect(eventHandlers.secretRotation).toHaveBeenCalledWith(handler, event.raw, ctx)
        })
    })

    test('sqs', async () => {
        const handler = sqsHandler({
            sqs: { handler: jest.fn(), schema: {} },
        })
        await asyncForAll(tuple(arbitrary(SQSEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.sqs.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: eventHandlers,
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(eventHandlers.sqs).toHaveBeenCalledWith(handler, event.Records, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(eventHandlers.sqs).not.toHaveBeenCalled()
            }
        })
    })

    test('sns', async () => {
        const handler = snsHandler({
            sns: { handler: jest.fn(), schema: {} },
        })
        await asyncForAll(tuple(arbitrary(SNSEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.sns.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event as LambdaSnsEvent,
                context: ctx,
                handlers: eventHandlers,
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(eventHandlers.sns).toHaveBeenCalledWith(handler, event.Records, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(eventHandlers.sns).not.toHaveBeenCalled()
            }
        })
    })

    test('kinesis', async () => {
        const handler = kinesisHandler({
            kinesis: { handler: jest.fn(), schema: {} },
        })
        await asyncForAll(tuple(arbitrary(KinesisStreamEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.kinesis.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: eventHandlers,
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(eventHandlers.kinesis).toHaveBeenCalledWith(handler, event.Records, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(eventHandlers.kinesis).not.toHaveBeenCalled()
            }
        })
    })

    test('s3', async () => {
        const handler = s3Handler({
            s3: { handler: jest.fn() },
        })
        await asyncForAll(tuple(arbitrary(S3Event), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.s3.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: eventHandlers,
            })
            if (event.Records.length > 0) {
                expect(response).toBe(ret)
                expect(eventHandlers.s3).toHaveBeenCalledWith(handler, event.Records, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(eventHandlers.s3).not.toHaveBeenCalled()
            }
        })
    })

    test('firehose', async () => {
        const handler = firehoseHandler({
            firehose: { handler: jest.fn(), schema: {} },
        })
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), unknown(), await context()),
            async ([event, ret, ctx]) => {
                eventHandlers.mockClear()
                eventHandlers.firehose.mockReturnValue(ret as any)

                const response = await handleEvent({
                    definition: handler as any,
                    request: event,
                    context: ctx,
                    handlers: eventHandlers,
                })
                if (event.records.length > 0) {
                    expect(response).toBe(ret)
                    expect(eventHandlers.firehose).toHaveBeenCalledWith(handler, event.records, ctx)
                } else {
                    expect(response).toBe(undefined)
                    expect(eventHandlers.firehose).not.toHaveBeenCalled()
                }
            }
        )
    })

    test('s3Batch', async () => {
        const handler = s3BatchHandler({
            s3Batch: { handler: jest.fn(), schema: {} },
        })
        await asyncForAll(tuple(arbitrary(S3BatchEvent), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.s3Batch.mockReturnValue(ret as any)

            const response = await handleEvent({
                definition: handler as any,
                request: event,
                context: ctx,
                handlers: eventHandlers,
            })
            if (event.tasks.length > 0) {
                expect(response).toBe(ret)
                expect(eventHandlers.s3Batch).toHaveBeenCalledWith(handler, event, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(eventHandlers.s3Batch).not.toHaveBeenCalled()
            }
        })
    })

    test.each([{ Records: [{ foo: 'bar' }] }, { records: [{ foo: 'bar' }] }])('unprocessable $event', async (event) => {
        const handler = rawHandler({
            raw: { handler: jest.fn(), schema: {} },
        })
        await asyncForAll(tuple(unknown(), await context()), async ([ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.raw.mockReturnValue(ret as any)

            const records = event.records ?? event.Records

            const response = await handleEvent({
                definition: handler as any,
                request: event as any,
                context: ctx,
                handlers: eventHandlers,
            })
            // @todo: is this what we want?
            if (records.length > 0) {
                expect(response).toBe(ret)
                expect(eventHandlers.raw).toHaveBeenCalledWith(handler, event, ctx)
            } else {
                expect(response).toBe(undefined)
                expect(eventHandlers.raw).not.toHaveBeenCalled()
            }
        })
    })

    test('raw', async () => {
        const handler = rawHandler({ raw: { schema: {}, handler: jest.fn() } })
        await asyncForAll(tuple(unknown(), unknown(), await context()), async ([event, ret, ctx]) => {
            eventHandlers.mockClear()
            eventHandlers.raw.mockReturnValue(ret as any)

            expect(await handleEvent({ definition: handler, request: event as any, context: ctx, handlers: eventHandlers })).toBe(
                ret
            )

            expect(eventHandlers.raw).toHaveBeenCalledWith(handler, event, ctx)
        })
    })
})

describe('createLambdaContext', () => {
    test('set manual observability', async () => {
        await asyncForAll(await context(), async (ctx) => {
            const l = mock<Logger>()
            const m = mock<Metrics>()
            const t = mock<Tracer>()
            const lCtx = await createLambdaContext({
                definition: { raw: { handler: jest.fn(), schema: {} } },
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

    test('set trace and request', async () => {
        await asyncForAll(tuple(await context(), string(), string()), async ([ctx, traceId, requestId]) => {
            const l = mock<Logger>()
            const m = mock<Metrics>()
            const t = mock<Tracer>()
            const lCtx = await createLambdaContext({
                definition: { raw: { handler: jest.fn(), schema: {} } },
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

    test('set trace and request from unknown generator', async () => {
        await asyncForAll(
            tuple(await context(), string({ minLength: 4 }), string({ minLength: 4 })),
            async ([ctx, traceId, requestId]) => {
                const l = mock<Logger>()
                const m = mock<Metrics>()
                const t = mock<Tracer>()
                const lCtx = await createLambdaContext({
                    definition: { raw: { handler: jest.fn(), schema: {} } },
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
    test('handler is definition', () => {
        forAll(dict(unknown()), (meta) => {
            const handler = eventHandler({
                raw: { schema: {}, handler: jest.fn() },
                ...meta,
            })
            expect(handler).toEqual(expect.objectContaining(meta))
        })
    })

    test('eager init calls config and services, sync', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = jest.fn().mockReturnValue(c)
            const services = jest.fn().mockReturnValue(s)
            eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
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

    test('eager init calls config and services, async', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = jest.fn().mockResolvedValue(c)
            const services = jest.fn().mockResolvedValue(s)
            eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
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

    test('lazy init calls not config and not services, async', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = jest.fn().mockResolvedValue(c)
            const services = jest.fn().mockResolvedValue(s)
            eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
                },
                { eagerHandlerInitialization: false }
            )
            // force event loop switching
            await sleep(10)
            expect(config).not.toHaveBeenCalled()
            expect(services).not.toHaveBeenCalled()
        })
    })

    test('default init calls not config and not services, async', async () => {
        await asyncForAll(tuple(unknown(), unknown()), async ([c, s]) => {
            const config = jest.fn().mockResolvedValue(c)
            const services = jest.fn().mockResolvedValue(s)
            eventHandler({
                config,
                services,
                raw: { schema: {}, handler: jest.fn() },
            })
            // force event loop switching
            await sleep(10)
            expect(config).not.toHaveBeenCalled()
            expect(services).not.toHaveBeenCalled()
        })
    })

    test('default init calls with literals', () => {
        forAll(tuple(unknown(), unknown()), ([c, s]) => {
            eventHandler({
                config: c as never,
                services: s as never,
                raw: { schema: {}, handler: jest.fn() },
            })
        })
    })

    test('early exit fully resolved on warmer', async () => {
        const warmer = '__WARMER__'
        await asyncForAll(tuple(unknown(), unknown(), await context()), async ([c, s, ctx]) => {
            const handlerImpl = jest.fn()
            const config = jest.fn().mockResolvedValue(c)
            const services = jest.fn().mockResolvedValue(s)
            const handler = eventHandler(
                {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
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

    test('configuration is loaded into profile successfully', async () => {
        const appConfigData = new AppConfigData({})
        const s = { appConfigData }
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), await context(), string(), dict(json())),
            async ([request, c, ret, ctx, token, profile]) => {
                jest.clearAllMocks()
                jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                    InitialConfigurationToken: token,
                } as any)
                jest.spyOn(appConfigData, 'getLatestConfiguration').mockReturnValue({
                    Configuration: JSON.stringify(profile),
                } as any)

                const l = ctx.logger
                const setbinding = jest.spyOn(l, 'setBindings')
                const m = createMetrics(mock())
                const t = createTracer(mock())

                const getSegment = mock<any>()
                ;(t.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(t.instance.getSegment as any).mockReturnValue(getSegment)

                const handlerImpl = jest.fn().mockResolvedValue(ret)
                const config = jest.fn().mockResolvedValue(c)
                const services = jest.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
                    profile: { schema: { schema: { type: 'object' }, is: () => true } },
                }
                const handler = eventHandler(definition as unknown as EventHandler, {
                    eventHandler: handlerImpl,
                    logger: l,
                    metrics: m,
                    tracer: t,
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
                expect(rCtx.logger).toBe(l)
                expect(rCtx.logger).not.toBe(logger)
                expect(rCtx.profile).toEqual(profile)
                expect(m.instance.publishStoredMetrics).toHaveBeenCalled()

                expect(getSegment.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegment.close).toHaveBeenCalled()
            }
        )
    })

    test('invalidating configuration is loaded into profile as failure', async () => {
        const appConfigData = new AppConfigData({})
        const s = { appConfigData }
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), await context(), string(), dict(json())),
            async ([request, c, ret, ctx, token, profile]) => {
                jest.clearAllMocks()
                jest.spyOn(appConfigData, 'startConfigurationSession').mockReturnValue({
                    InitialConfigurationToken: token,
                } as any)
                jest.spyOn(appConfigData, 'getLatestConfiguration').mockReturnValue({
                    Configuration: JSON.stringify(profile),
                } as any)

                const l = createLogger({ instance: mock() })
                const m = createMetrics(mock())
                const t = createTracer(mock())

                const getSegment = mock<any>()
                ;(t.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(t.instance.getSegment as any).mockReturnValue(getSegment)

                const handlerImpl = jest.fn().mockResolvedValue(ret)
                const config = jest.fn().mockResolvedValue(c)
                const services = jest.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
                    profile: { schema: { schema: { type: 'object' }, is: () => false } },
                }
                const handler = eventHandler(definition as unknown as EventHandler, {
                    eventHandler: handlerImpl,
                    logger: l,
                    metrics: m,
                    tracer: t,
                }) as LambdaHandler

                await expect(() => handler(request, ctx.raw)).rejects.toThrowError(expect.any(EventError))
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).not.toHaveBeenCalled()
                expect(m.instance.publishStoredMetrics).toHaveBeenCalled()

                expect(getSegment.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegment.close).toHaveBeenCalled()
            }
        )
    })
    test('success resolves to success', async () => {
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), unknown(), await context()),
            async ([request, c, s, ret, ctx]) => {
                const l = ctx.logger
                const setbinding = jest.spyOn(l, 'setBindings')
                const m = createMetrics(mock())
                const t = createTracer(mock())

                const getSegment = mock<any>()
                ;(t.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(t.instance.getSegment as any).mockReturnValue(getSegment)

                const handlerImpl = jest.fn().mockResolvedValue(ret)
                const config = jest.fn().mockResolvedValue(c)
                const services = jest.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
                }
                const handler = eventHandler(definition, {
                    eventHandler: handlerImpl,
                    logger: l,
                    metrics: m,
                    tracer: t,
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
                expect(rCtx.logger).toBe(l)
                expect(rCtx.logger).not.toBe(logger)
                expect(m.instance.publishStoredMetrics).toHaveBeenCalled()

                expect(getSegment.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegment.close).toHaveBeenCalled()
            }
        )
    })

    test('failure resolves to failure', async () => {
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), unknown().map(failure), await context()),
            async ([request, c, s, ret, ctx]) => {
                const l = ctx.logger
                const setbinding = jest.spyOn(l, 'setBindings')

                const m = createMetrics(mock())
                const t = createTracer(mock())

                const getSegment = mock<any>()
                ;(t.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(t.instance.getSegment as any).mockReturnValue(getSegment)

                const handlerImpl = jest.fn().mockResolvedValue(ret)
                const config = jest.fn().mockResolvedValue(c)
                const services = jest.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
                }
                const handler = eventHandler(definition, {
                    eventHandler: handlerImpl,
                    logger: l,
                    metrics: m,
                    tracer: t,
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
                expect(rCtx.logger).toBe(l)
                expect(rCtx.logger).not.toBe(logger)
                expect(m.instance.publishStoredMetrics).toHaveBeenCalled()

                expect(getSegment.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegment.close).toHaveBeenCalled()
            }
        )
    })

    test('graceful failure resolves to success', async () => {
        await asyncForAll(
            tuple(
                unknown(),
                unknown(),
                unknown(),
                string().map((f) => {
                    const error = new EventError(f, { errorHandling: 'graceful' })
                    return error
                }),
                await context()
            ),
            async ([request, c, s, ret, ctx]) => {
                const l = ctx.logger
                const setbinding = jest.spyOn(l, 'setBindings')

                const m = createMetrics(mock())
                const t = createTracer(mock())

                const getSegment = mock<any>()
                ;(t.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(t.instance.getSegment as any).mockReturnValue(getSegment)

                const handlerImpl = jest.fn().mockResolvedValue(ret)
                const config = jest.fn().mockResolvedValue(c)
                const services = jest.fn().mockResolvedValue(s)
                const definition = {
                    config,
                    services,
                    raw: { schema: {}, handler: jest.fn() },
                }
                const handler = eventHandler(definition, {
                    eventHandler: handlerImpl,
                    logger: l,
                    metrics: m,
                    tracer: t,
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
                expect(rCtx.logger).toBe(l)
                expect(rCtx.logger).not.toBe(logger)
                expect(m.instance.publishStoredMetrics).toHaveBeenCalled()

                expect(getSegment.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegment.close).toHaveBeenCalled()
            }
        )
    })
})
