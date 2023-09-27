import { handleSQSEvent } from './handler.js'

import { EventError } from '../../errors/event-error/index.js'

import { asyncForAll, enumerate, json, random, tuple } from '@skyleague/axioms'
import { SQSEvent } from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import type { Schema } from '@skyleague/therefore'
import { arbitrary } from '@skyleague/therefore'
import type { SQSRecord } from 'aws-lambda/trigger/sqs.js'
import { expect, it, vi } from 'vitest'

it('plaintext events does not give failures', async () => {
    await asyncForAll(tuple(arbitrary(SQSEvent), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn()
        const response = await handleSQSEvent(
            { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
            Records as SQSRecord[],
            ctx
        )

        expect(response).toEqual(undefined)

        for (const [i, record] of enumerate(Records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', { item: i, response: undefined })
        }

        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it('json events does not give failures', async () => {
    await asyncForAll(
        tuple(arbitrary(SQSEvent), await context({})).map(([e, ctx]) => {
            for (const record of e.Records) {
                record.body = JSON.stringify(random(json({})))
            }
            return [e, ctx] as const
        }),
        async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn()
            const response = await handleSQSEvent({ sqs: { schema: {}, handler } }, Records as SQSRecord[], ctx)

            expect(response).toEqual(undefined)

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        }
    )
})

it('json parse failure, gives failure', async () => {
    await asyncForAll(
        tuple(arbitrary(SQSEvent), await context({})).map(([e, ctx]) => {
            for (const record of e.Records) {
                record.body = `${JSON.stringify(random(json({})))}{`
            }
            return [e, ctx] as const
        }),
        async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn()
            const response = await handleSQSEvent({ sqs: { schema: {}, handler } }, Records as SQSRecord[], ctx)

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
            }

            expect(handler).not.toHaveBeenCalled()

            for (const [i, record] of enumerate(Records)) {
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: expect.any(SyntaxError),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                    item: i,
                    response: { itemIdentifier: record.messageId },
                })
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
            }
        }
    )
})

it('schema validation, gives failure', async () => {
    const neverTrue = {
        is: () => false,
        errors: [],
    } as unknown as Schema<string>
    await asyncForAll(
        tuple(arbitrary(SQSEvent), await context({})).map(([e, ctx]) => {
            for (const record of e.Records) {
                record.body = JSON.stringify(random(json({})))
            }
            return [e, ctx] as const
        }),
        async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn()
            const response = await handleSQSEvent(
                { sqs: { schema: { payload: neverTrue }, handler } },
                Records as SQSRecord[],
                ctx
            )

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
            }

            expect(handler).not.toHaveBeenCalled()

            for (const [i, record] of enumerate(Records)) {
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: expect.any(EventError),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                    item: i,
                    response: { itemIdentifier: record.messageId },
                })

                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), EventError.validation())
            }
        }
    )
})

it.each([new Error(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(SQSEvent), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
        const response = await handleSQSEvent(
            { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
            Records as SQSRecord[],
            ctx
        )

        if (Records.length > 0) {
            expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
        }

        for (const [i, record] of enumerate(Records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                item: i,
                response: { itemIdentifier: record.messageId },
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})

it.each([EventError.badRequest()])('promise reject with error error, gives errors', async (error) => {
    await asyncForAll(tuple(arbitrary(SQSEvent), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
        const response = await handleSQSEvent(
            { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
            Records as SQSRecord[],
            ctx
        )

        if (Records.length > 0) {
            expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
        }

        for (const [i, record] of enumerate(Records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                item: i,
                response: { itemIdentifier: record.messageId },
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, EventError.from(error).message, expect.any(EventError))
        }
    })
})

it.each([new Error(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(SQSEvent), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleSQSEvent(
            { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
            Records as SQSRecord[],
            ctx
        )

        if (Records.length > 0) {
            expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
        }

        for (const [i, record] of enumerate(Records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                item: i,
                response: { itemIdentifier: record.messageId },
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})

it.each([EventError.badRequest()])('promise throws with client error, gives errors', async (error) => {
    await asyncForAll(tuple(arbitrary(SQSEvent), await context({})), async ([{ Records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleSQSEvent(
            { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
            Records as SQSRecord[],
            ctx
        )

        if (Records.length > 0) {
            expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
        }

        for (const [i, record] of enumerate(Records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                item: i,
                response: { itemIdentifier: record.messageId },
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, EventError.from(error).message, expect.any(EventError))
        }
    })
})
