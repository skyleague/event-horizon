import { handleEventBridgeEvent } from './handler.js'

import { alwaysTrueSchema, neverTrueSchema } from '../../../test/schema.js'
import { eventBridgeEvent } from '../../dev/event-horizon/eventbridge/eventbridge.js'
import { context } from '../../dev/test/context/context.js'
import { EventError } from '../../errors/event-error/event-error.js'

import { asyncForAll, failure, json, tuple } from '@skyleague/axioms'
import { expect, it, vi } from 'vitest'

it('success does not give failures', async () => {
    const h = vi.fn()
    const handler = { eventBridge: { schema: {}, handler: h } }
    await asyncForAll(tuple(eventBridgeEvent(handler), json(), await context({})), async ([value, ret, ctx]) => {
        ctx.mockClear()
        h.mockClear()

        h.mockResolvedValueOnce(ret)

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
    const handler = { eventBridge: { schema: { payload: neverTrueSchema }, handler: h } }
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
    const handler = { eventBridge: { schema: { payload: alwaysTrueSchema, result: neverTrueSchema }, handler: h } }
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
    const handler = { eventBridge: { schema: { payload: alwaysTrueSchema, result: neverTrueSchema }, handler: h } }
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
    const handler = { eventBridge: { schema: { payload: alwaysTrueSchema, result: neverTrueSchema }, handler: h } }
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
