import { handleRawEvent } from './handler.js'

import { EventError } from '../../errors/event-error/event-error.js'
import { context } from '../../test/test/context/context.js'

import { asyncForAll, failure, json, tuple } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'

it('success does not give failures', async () => {
    await asyncForAll(tuple(json(), json(), await context({})), async ([value, ret, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockReturnValue(ret)
        const response = await handleRawEvent({ raw: { schema: {}, handler } }, value, ctx)

        expect(response).toEqual(ret)

        expect(handler).toHaveBeenCalledWith(value, ctx)

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[raw] start', {
            event: value,
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[raw] sent', { response: ret })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it('schema validation, gives failure', async () => {
    const neverTrue = {
        is: () => false,
        errors: [],
    } as unknown as Schema<string>
    await asyncForAll(tuple(json(), await context({})), async ([value, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn()
        const response = await handleRawEvent({ raw: { schema: { payload: neverTrue }, handler } }, value, ctx)

        expect(response).toEqual(EventError.validation())

        expect(handler).not.toHaveBeenCalled()

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[raw] start', {
            event: value,
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[raw] sent', { response: undefined })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(json(), await context({})), async ([value, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
        const response = await handleRawEvent({ raw: { schema: {}, handler } }, value, ctx)

        expect(response).toEqual(failure(error))

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[raw] start', {
            event: value,
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[raw] sent', { response: undefined })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(json(), await context({})), async ([value, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleRawEvent({ raw: { schema: {}, handler } }, value, ctx)

        expect(response).toEqual(failure(error))

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[raw] start', {
            event: value,
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[raw] sent', { response: undefined })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})
