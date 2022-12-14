import { handleKinesisEvent } from './handler'

import { EventError } from '../../errors/event-error'

import { asyncForAll, enumerate, json, random, tuple } from '@skyleague/axioms'
import { context, KinesisStreamEvent } from '@skyleague/event-horizon-dev'
import type { Schema } from '@skyleague/therefore'
import { arbitrary } from '@skyleague/therefore'

describe('handler', () => {
    test('binary events does not give failures', async () => {
        await asyncForAll(tuple(arbitrary(KinesisStreamEvent), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn()
            const response = await handleKinesisEvent({ kinesis: { schema: {}, handler, payloadType: 'binary' } }, Records, ctx)

            expect(response).toEqual(undefined)

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test('plaintext events does not give failures', async () => {
        await asyncForAll(tuple(arbitrary(KinesisStreamEvent), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn()
            const response = await handleKinesisEvent(
                { kinesis: { schema: {}, handler, payloadType: 'plaintext' } },
                Records,
                ctx
            )

            expect(response).toEqual(undefined)

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test('json events does not give failures', async () => {
        await asyncForAll(
            tuple(arbitrary(KinesisStreamEvent), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.kinesis.data = Buffer.from(JSON.stringify(random(json({})))).toString('base64')
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = jest.fn()
                const response = await handleKinesisEvent({ kinesis: { schema: {}, handler } }, Records, ctx)

                expect(response).toEqual(undefined)

                for (const [i, record] of enumerate(Records)) {
                    expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                        event: expect.objectContaining({
                            raw: record,
                        }),
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', { item: i, response: undefined })
                }

                expect(ctx.logger.error).not.toHaveBeenCalled()
            }
        )
    })

    test('json parse failure, gives failure', async () => {
        await asyncForAll(
            tuple(arbitrary(KinesisStreamEvent), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.kinesis.data = Buffer.from(`${JSON.stringify(random(json({})))}{[error]`).toString('base64')
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = jest.fn()
                const response = await handleKinesisEvent({ kinesis: { schema: {}, handler } }, Records, ctx)

                if (Records.length > 0) {
                    expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.eventID })) })
                }

                expect(handler).not.toHaveBeenCalled()

                for (const [i, record] of enumerate(Records)) {
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                        event: undefined,
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', {
                        item: i,
                        response: { itemIdentifier: record.eventID },
                    })
                    expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, 'Uncaught error found', expect.any(EventError))
                }
            }
        )
    })

    test('schema validation, gives failure', async () => {
        const neverTrue = {
            is: () => false,
            errors: [],
        } as unknown as Schema<string>
        await asyncForAll(
            tuple(arbitrary(KinesisStreamEvent), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.kinesis.data = Buffer.from(JSON.stringify(random(json({})))).toString('base64')
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = jest.fn()
                const response = await handleKinesisEvent({ kinesis: { schema: { payload: neverTrue }, handler } }, Records, ctx)

                if (Records.length > 0) {
                    expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.eventID })) })
                }

                expect(handler).not.toHaveBeenCalled()

                for (const [i, record] of enumerate(Records)) {
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                        event: undefined,
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', {
                        item: i,
                        response: { itemIdentifier: record.eventID },
                    })

                    expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, 'Uncaught error found', EventError.validation())
                }
            }
        )
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(KinesisStreamEvent), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockRejectedValue(error)
            const response = await handleKinesisEvent({ kinesis: { schema: {}, handler, payloadType: 'binary' } }, Records, ctx)

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.eventID })) })
            }

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', {
                    item: i,
                    response: { itemIdentifier: record.eventID },
                })
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, 'Uncaught error found', expect.any(EventError))
            }
        })
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(KinesisStreamEvent), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleKinesisEvent({ kinesis: { schema: {}, handler, payloadType: 'binary' } }, Records, ctx)

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.eventID })) })
            }

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[kinesis] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[kinesis] sent', {
                    item: i,
                    response: { itemIdentifier: record.eventID },
                })
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, 'Uncaught error found', expect.any(EventError))
            }
        })
    })
})
