import { errorHandler } from './error-handler'

import { EventError } from '../../errors'

import { forAll, string, tuple, unknown } from '@skyleague/axioms'
import { context } from '@skyleague/event-horizon-dev'

test('unrelated error becomes internal server event error', async () => {
    forAll(tuple(await context(), unknown()), ([ctx, error]) => {
        ctx.mockClear()
        const handler = errorHandler(ctx)
        handler.onError(error)

        expect(ctx.logger.error).toHaveBeenCalledWith('Uncaught error found', expect.any(EventError))
    })
})

test('server event error becomes error', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => new EventError(c))
        ),
        ([ctx, error]) => {
            ctx.mockClear()
            const handler = errorHandler(ctx)
            handler.onError(error)

            expect(ctx.logger.error).toHaveBeenCalledWith('Uncaught error found', expect.any(EventError))
        }
    )
})

test('client event error becomes warning', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => new EventError(c, { statusCode: 400 }))
        ),
        ([ctx, error]) => {
            ctx.mockClear()
            const handler = errorHandler(ctx)
            handler.onError(error)

            expect(ctx.logger.warn).toHaveBeenCalledWith('Warning found', expect.any(EventError))
        }
    )
})
