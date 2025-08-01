import { DynamoDBStreamSchema } from '@aws-lambda-powertools/parser/schemas'
import { asyncForAll, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import type { DynamoDBStreamRecord } from '../../aws/dynamodb.js'
import { EventError } from '../../errors/event-error/event-error.js'
import { context } from '../../test/context/context.js'
import { handleDynamoDBStreamEvent } from './handler.js'

it('events does not give failures', async () => {
    await asyncForAll(tuple(arbitrary(DynamoDBStreamSchema), await context()), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn()
        const response = await handleDynamoDBStreamEvent({ dynamodb: { handler } }, Records as DynamoDBStreamRecord[], ctx)

        expect(response).toEqual(undefined)

        for (const [i, record] of Records.entries()) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[dynamodb] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[dynamodb] sent', { item: i, response: undefined })
        }

        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([new Error(), EventError.badRequest(), 'foobar'])('%s - promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(DynamoDBStreamSchema), await context()), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
        const response = await handleDynamoDBStreamEvent({ dynamodb: { handler } }, Records as DynamoDBStreamRecord[], ctx)

        if (Records.length > 0) {
            expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.eventID })) })
        }

        for (const [i, record] of Records.entries()) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[dynamodb] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[dynamodb] sent', {
                item: i,
                response: undefined,
            })

            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})

it.each([new Error(), EventError.badRequest(), 'foobar'])('%s - promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(DynamoDBStreamSchema), await context()), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleDynamoDBStreamEvent({ dynamodb: { handler } }, Records as DynamoDBStreamRecord[], ctx)

        if (Records.length > 0) {
            expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.eventID })) })
        }

        for (const [i, record] of Records.entries()) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[dynamodb] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[dynamodb] sent', {
                item: i,
                response: undefined,
            })

            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})
