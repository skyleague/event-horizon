import { httpErrorHandler } from './error-handler'

import { EventError } from '../../../errors/event-error'

import { forAll, string, tuple, unknown } from '@skyleague/axioms'
import { context } from '@skyleague/event-horizon-dev'

test('unrelated error becomes internal server event error', async () => {
    forAll(tuple(await context(), unknown()), ([ctx, error]) => {
        ctx.mockClear()
        const handler = httpErrorHandler(ctx)

        expect(handler.onError(error)).toEqual({
            body: { message: 'EventError', stack: undefined, statusCode: 500 },
            statusCode: 500,
        })

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
            const handler = httpErrorHandler(ctx)

            expect(handler.onError(error)).toEqual({
                body: { message: 'EventError', stack: undefined, statusCode: 500 },
                statusCode: 500,
            })

            expect(ctx.logger.error).toHaveBeenCalledWith('Uncaught error found', expect.any(EventError))
        }
    )
})

test('client event error becomes info', async () => {
    forAll(
        tuple(
            await context(),
            string().map((c) => new EventError(c, { statusCode: 400 }))
        ),
        ([ctx, error]) => {
            ctx.mockClear()
            const handler = httpErrorHandler(ctx)

            expect(handler.onError(error)).toEqual({
                body: { message: error.message, stack: undefined, statusCode: 400 },
                statusCode: 400,
            })

            expect(ctx.logger.info).toHaveBeenCalledWith('Client error found', expect.any(EventError))
        }
    )
})
