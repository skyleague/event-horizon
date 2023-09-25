import { createLambdaContext, eventHandler } from './event.js'
import type { LambdaHandler } from './raw-aws.js'

import { alwaysTrueSchema, neverTrueSchema } from '../../../test/schema.js'
import { EventError } from '../../errors/index.js'
import { logger } from '../../observability/logger/logger.js'

import 'aws-sdk-client-mock-jest'

import {
    AppConfigData,
    AppConfigDataClient,
    GetLatestConfigurationCommand,
    StartConfigurationSessionCommand,
} from '@aws-sdk/client-appconfigdata'
import { asyncForAll, dict, failure, forAll, json, sleep, string, tuple, unknown } from '@skyleague/axioms'
import { context, mockLogger, mockMetrics, mockTracer } from '@skyleague/event-horizon-dev/test'
import { mockClient } from 'aws-sdk-client-mock'
import { expect, describe, it, vi } from 'vitest'

describe('createLambdaContext', () => {
    it('set manual observability', async () => {
        await asyncForAll(await context(), async (ctx) => {
            const l = mockLogger()
            const m = mockMetrics()
            const t = mockTracer()
            const lCtx = await createLambdaContext({
                definition: {},
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
                definition: {},
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
                    definition: {},
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
            const handler = eventHandler(
                {
                    ...meta,
                },
                { handler: vi.fn() }
            )
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
                },
                { eagerHandlerInitialization: true, handler: vi.fn() }
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
                },
                { eagerHandlerInitialization: true, handler: vi.fn() }
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
                },
                { eagerHandlerInitialization: false, handler: vi.fn() }
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
            eventHandler(
                {
                    config,
                    services,
                },
                { handler: vi.fn() }
            )
            // force event loop switching
            await sleep(10)
            expect(config).not.toHaveBeenCalled()
            expect(services).not.toHaveBeenCalled()
        })
    })

    it('default init calls with literals', () => {
        forAll(tuple(unknown(), unknown()), ([c, s]) => {
            eventHandler(
                {
                    config: c as never,
                    services: s as never,
                },
                { handler: vi.fn() }
            )
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
                },
                { handler: handlerImpl }
            ) as LambdaHandler

            expect(await handler(warmer, ctx.raw)).toBe(undefined)
            expect(config).toHaveBeenCalledTimes(1)
            expect(config).toHaveBeenCalledWith()
            expect(services).toHaveBeenCalledTimes(1)
            expect(services).toHaveBeenCalledWith(c)

            expect(handlerImpl).not.toHaveBeenCalled()
        })
    })

    const tokenArbitrary = string({ minLength: 1 })
    it('configuration is loaded into profile successfully', async () => {
        const appConfigData = new AppConfigData({})
        const s = { appConfigData }
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), await context(), tokenArbitrary, dict(json())),
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
                    flush: vi.fn(),
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

                const handler = eventHandler(
                    {
                        config,
                        services,
                        profile: { schema: alwaysTrueSchema },
                        logger: ctx.logger,
                        metrics: ctx.metrics,
                        tracer: ctx.tracer,
                    },
                    {
                        handler: handlerImpl,
                    }
                ) as LambdaHandler

                expect(await handler(request, ctx.raw)).toBe(ret)
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith(request, expect.objectContaining({ raw: ctx.raw }))

                const rCtx = handlerImpl.mock.calls[0][1]
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(rCtx.profile).toEqual(profile)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
                expect(getSegmentVal.flush).toHaveBeenCalled()
            }
        )
    })

    it('invalidating configuration is loaded into profile as failure', async () => {
        const appConfigData = new AppConfigData({})
        const s = { appConfigData }
        await asyncForAll(
            tuple(unknown(), unknown(), unknown(), await context(), tokenArbitrary, dict(json())),
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
                    flush: vi.fn(),
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

                const handler = eventHandler(
                    {
                        config,
                        services,
                        profile: { schema: neverTrueSchema },
                        logger: ctx.logger,
                        metrics: ctx.metrics,
                        tracer: ctx.tracer,
                    },
                    {
                        handler: handlerImpl,
                    }
                ) as LambdaHandler

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
                expect(getSegmentVal.flush).toHaveBeenCalled()
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
                    flush: vi.fn(),
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

                const handler = eventHandler(
                    {
                        config,
                        services,
                        logger: ctx.logger,
                        metrics: ctx.metrics,
                        tracer: ctx.tracer,
                    },
                    {
                        handler: handlerImpl,
                    }
                ) as LambdaHandler

                expect(await handler(request, ctx.raw)).toBe(ret)
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith(request, expect.objectContaining({ raw: ctx.raw }))

                const rCtx = handlerImpl.mock.calls[0][1]
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
                expect(getSegmentVal.flush).toHaveBeenCalled()
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

                const getSegmentVal = {
                    addNewSubsegment: vi.fn(),
                    close: vi.fn(),
                    flush: vi.fn(),
                }
                ;(ctx.tracer.instance.isTracingEnabled as any).mockReturnValue(true)
                ;(ctx.tracer.instance.getSegment as any).mockReturnValue(getSegmentVal)

                const handlerImpl = vi.fn().mockResolvedValue(ret)
                const config = vi.fn().mockResolvedValue(c)
                const services = vi.fn().mockResolvedValue(s)

                const handler = eventHandler(
                    {
                        config,
                        services,
                        logger: ctx.logger,
                        metrics: ctx.metrics,
                        tracer: ctx.tracer,
                    },
                    {
                        handler: handlerImpl,
                    }
                ) as LambdaHandler

                await expect(() => handler(request, ctx.raw)).rejects.toEqual(ret)
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith(request, expect.objectContaining({ raw: ctx.raw }))

                const rCtx = handlerImpl.mock.calls[0][1]
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
                expect(getSegmentVal.flush).toHaveBeenCalled()
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
                    flush: vi.fn(),
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
                const handler = eventHandler(
                    {
                        config,
                        services,
                        logger: ctx.logger,
                        metrics: ctx.metrics,
                        tracer: ctx.tracer,
                    },
                    {
                        handler: handlerImpl,
                    }
                ) as LambdaHandler

                expect(await handler(request, ctx.raw)).toEqual({})
                expect(config).toHaveBeenCalledTimes(1)
                expect(config).toHaveBeenCalledWith()
                expect(services).toHaveBeenCalledTimes(1)
                expect(services).toHaveBeenCalledWith(c)

                expect(handlerImpl).toHaveBeenCalledWith(request, expect.objectContaining({ raw: ctx.raw }))

                const rCtx = handlerImpl.mock.calls[0][1]
                expect(setbinding).toBeCalledWith({ requestId: rCtx.requestId, traceId: rCtx.traceId })
                expect(rCtx.logger).toBe(ctx.logger)
                expect(rCtx.logger).not.toBe(logger)
                expect(ctx.metrics.instance.publishStoredMetrics).toHaveBeenCalled()
                expect(ctx.metrics.instance.captureColdStartMetric).toHaveBeenCalled()

                expect(getSegmentVal.addNewSubsegment).toHaveBeenLastCalledWith('## ')
                expect(getSegmentVal.close).toHaveBeenCalled()
                expect(getSegmentVal.flush).toHaveBeenCalled()
            }
        )
    })
})
