/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { handleS3Event } from './handler'

import { EventError } from '../../errors/event-error'

import { asyncForAll, enumerate, failure, tuple } from '@skyleague/axioms'
import { context, S3Event } from '@skyleague/event-horizon-dev'
import { arbitrary } from '@skyleague/therefore'

describe('handler', () => {
    test('events do not give failures', async () => {
        await asyncForAll(tuple(arbitrary(S3Event), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn()
            const response = await handleS3Event({ s3: { handler } }, Records, ctx)

            expect(response).toEqual(undefined)

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(S3Event), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockRejectedValue(error)
            const response = await handleS3Event({ s3: { handler } }, Records, ctx)

            if (Records.length > 0) {
                expect(response).toEqual(failure(error))
            }

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3] sent', {
                    item: i,
                    response: undefined,
                })
                // it stops on the first error found
                break
            }
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(S3Event), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleS3Event({ s3: { handler } }, Records, ctx)

            if (Records.length > 0) {
                expect(response).toEqual(failure(error))
            }

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3] sent', {
                    item: i,
                    response: undefined,
                })
                // it stops on the first error found
                break
            }
            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })
})
