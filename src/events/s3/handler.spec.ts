import { handleS3Event } from './handler.js'

import { S3Event } from '../../dev/aws/s3/s3.type.js'
import { context } from '../../dev/test/context/context.js'
import { EventError } from '../../errors/event-error/event-error.js'

import { asyncForAll, enumerate, failure, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'

it('events do not give failures', async () => {
    await asyncForAll(tuple(arbitrary(S3Event), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn()
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

it.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(S3Event), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
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

it.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(S3Event), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
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
