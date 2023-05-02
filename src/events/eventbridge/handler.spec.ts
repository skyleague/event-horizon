import { handleEventBridgeEvent } from './handler.js'

import { EventError } from '../../errors/index.js'

import { asyncForAll, failure, json, tuple } from '@skyleague/axioms'
import { eventBridgeEvent } from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import type { Schema } from '@skyleague/therefore'
import { expect, describe, it, vi } from 'vitest'

describe('handler', () => {
    const neverTrue = {
        is: () => false,
        schema: {},
        validate: {
            errors: [],
        },
    } as unknown as Schema<string>

    const alwaysTrue = {
        is: () => true,
        schema: {},
        validate: {
            errors: [],
        },
    } as unknown as Schema<string>

    it('success does not give failures', async () => {
        const h = vi.fn()
        const handler = { eventBridge: { schema: {}, handler: h } }
        await asyncForAll(tuple(eventBridgeEvent(handler), json(), await context({})), async ([value, ret, ctx]) => {
            ctx.mockClear()
            h.mockClear()

            h.mockReturnValue(ret)

            const response = await handleEventBridgeEvent(handler, value.raw, ctx)

            expect(response).toEqual(ret)

            expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: value.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[eventbridge] start', {
                event: expect.objectContaining({ raw: value.raw }),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[eventbridge] sent', { response: ret })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    it('payload schema validation, gives failure', async () => {
        const h = vi.fn()
        const handler = { eventBridge: { schema: { payload: neverTrue }, handler: h } }
        await asyncForAll(tuple(eventBridgeEvent(handler), await context({})), async ([value, ctx]) => {
            ctx.mockClear()
            h.mockClear()

            const response = await handleEventBridgeEvent(handler, value.raw, ctx)

            expect(response).toEqual(EventError.validation())

            expect(h).not.toHaveBeenCalled()

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[eventbridge] start', {
                event: expect.any(EventError),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[eventbridge] sent', { response: expect.any(EventError) })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    it('result schema validation, gives failure', async () => {
        const h = vi.fn()
        const handler = { eventBridge: { schema: { payload: alwaysTrue, result: neverTrue }, handler: h } }
        await asyncForAll(tuple(eventBridgeEvent(handler), await context({})), async ([value, ctx]) => {
            ctx.mockClear()
            h.mockClear()

            const response = await handleEventBridgeEvent(handler, value.raw, ctx)

            expect(response).toEqual(EventError.validation())

            expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: value.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[eventbridge] start', {
                event: expect.objectContaining({ raw: value.raw }),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[eventbridge] sent', { response: expect.any(EventError) })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    it.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
        const h = vi.fn()
        const handler = { eventBridge: { schema: { payload: alwaysTrue, result: neverTrue }, handler: h } }
        await asyncForAll(tuple(eventBridgeEvent(handler), await context({})), async ([value, ctx]) => {
            ctx.mockClear()
            h.mockClear()

            h.mockRejectedValue(error)

            const response = await handleEventBridgeEvent(handler, value.raw, ctx)

            expect(response).toEqual(failure(error))

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[eventbridge] start', {
                event: expect.objectContaining({ raw: value.raw }),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[eventbridge] sent', { response: failure(error) })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    it.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        const h = vi.fn()
        const handler = { eventBridge: { schema: { payload: alwaysTrue, result: neverTrue }, handler: h } }
        await asyncForAll(tuple(eventBridgeEvent(handler), await context({})), async ([value, ctx]) => {
            ctx.mockClear()
            h.mockClear()

            h.mockImplementation(() => {
                throw error
            })

            const response = await handleEventBridgeEvent(handler, value.raw, ctx)

            expect(response).toEqual(failure(error))

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[eventbridge] start', {
                event: expect.objectContaining({ raw: value.raw }),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[eventbridge] sent', { response: failure(error) })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })
})
