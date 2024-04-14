import { errorHandler } from './error-handler.js'

import { EventError } from '../../../errors/event-error/event-error.js'
import { context } from '../../../test/test/context/context.js'

import { forAll, string, tuple, unknown } from '@skyleague/axioms'
import { expect, it } from 'vitest'

it('unrelated error becomes internal server event error', async () => {
    forAll(tuple(await context(), unknown()), ([ctx, error]) => {
        ctx.mockClear()
        const handler = errorHandler(ctx)
        handler.onError(error)

        expect(ctx.logger.error).toHaveBeenCalledWith('unknown', expect.any(EventError))
    })
})

it('server event error becomes error', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => [c, new EventError(c)]),
        ),
        ([ctx, [message, error]]) => {
            ctx.mockClear()
            const handler = errorHandler(ctx)
            handler.onError(error)

            expect(ctx.logger.error).toHaveBeenCalledWith(message, expect.any(EventError))
        },
    )
})

it('client event error becomes warning', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => [c, new EventError(c, { statusCode: 400 })]),
        ),
        ([ctx, [message, error]]) => {
            ctx.mockClear()
            const handler = errorHandler(ctx)
            handler.onError(error)

            expect(ctx.logger.warn).toHaveBeenCalledWith(message, expect.any(EventError))
        },
    )
})
