import { forAll, random, string, tuple, unknown } from '@skyleague/axioms'
import { expect, it } from 'vitest'
import { EventError } from '../../../../errors/event-error/event-error.js'
import { context } from '../../../../test/context/context.js'
import { authorizerErrorHandler } from './error-handler.js'

it('unrelated error becomes internal server event error', async () => {
    const ctx = random(await context())
    forAll(unknown(), (error) => {
        ctx.mockClear()
        const handler = authorizerErrorHandler(ctx)

        expect(handler.onError(error)).toEqual(new Error('Unauthorized'))

        expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
    })
})

it('server event error becomes error', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => new EventError(c)),
        ),
        ([ctx, error]) => {
            ctx.mockClear()
            const handler = authorizerErrorHandler(ctx)

            expect(handler.onError(error)).toEqual(new Error('Unauthorized'))

            expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
        },
    )
})

it('client event error becomes info', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => new EventError(c, { statusCode: 400 })),
        ),
        ([ctx, error]) => {
            ctx.mockClear()
            const handler = authorizerErrorHandler(ctx)

            expect(handler.onError(error)).toEqual(new Error('Unauthorized'))

            expect(ctx.logger.info).toHaveBeenCalledWith('Client error found', expect.any(EventError))
        },
    )
})
