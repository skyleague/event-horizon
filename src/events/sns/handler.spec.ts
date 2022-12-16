import { handleSNSEvent } from './handler'

import { EventError } from '../../errors/event-error'

import { asyncForAll, enumerate, failure, json, random, tuple } from '@skyleague/axioms'
import { context, SNSEvent } from '@skyleague/event-horizon-dev'
import type { Schema } from '@skyleague/therefore'
import { arbitrary } from '@skyleague/therefore'
import type { SNSEventRecord } from 'aws-lambda/trigger/sns'

describe('handler', () => {
    test('binary events does not give failures', async () => {
        await asyncForAll(tuple(arbitrary(SNSEvent), await context()), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn()
            const response = await handleSNSEvent(
                { sns: { schema: {}, handler, payloadType: 'binary' } },
                Records as SNSEventRecord[],
                ctx
            )

            expect(response).toEqual(undefined)

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test('plaintext events does not give failures', async () => {
        await asyncForAll(tuple(arbitrary(SNSEvent), await context()), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn()
            const response = await handleSNSEvent(
                { sns: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SNSEventRecord[],
                ctx
            )

            expect(response).toEqual(undefined)

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    test('json events does not give failures', async () => {
        await asyncForAll(
            tuple(arbitrary(SNSEvent), await context()).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.Sns.Message = JSON.stringify(random(json({})))
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = jest.fn()
                const response = await handleSNSEvent({ sns: { schema: {}, handler } }, Records as SNSEventRecord[], ctx)

                expect(response).toEqual(undefined)

                for (const [i, record] of enumerate(Records)) {
                    expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                        event: expect.objectContaining({
                            raw: record,
                        }),
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', { item: i, response: undefined })
                }

                expect(ctx.logger.error).not.toHaveBeenCalled()
            }
        )
    })

    test('json parse failure, gives failure', async () => {
        await asyncForAll(
            tuple(arbitrary(SNSEvent), await context()).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.Sns.Message = `${JSON.stringify(random(json({})))}{`
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = jest.fn()
                const response = await handleSNSEvent({ sns: { schema: {}, handler } }, Records as SNSEventRecord[], ctx)

                if (Records.length > 0) {
                    expect(response).toEqual(expect.any(SyntaxError))
                }

                expect(handler).not.toHaveBeenCalled()

                for (const [i, _] of enumerate(Records)) {
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                        event: expect.any(SyntaxError),
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', {
                        item: i,
                        response: undefined,
                    })
                    expect(ctx.logger.error).not.toHaveBeenCalled()

                    // it stops on the first error found
                    break
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
            tuple(arbitrary(SNSEvent), await context()).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.Sns.Message = JSON.stringify(random(json({})))
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = jest.fn()
                const response = await handleSNSEvent(
                    { sns: { schema: { payload: neverTrue }, handler } },
                    Records as SNSEventRecord[],
                    ctx
                )

                if (Records.length > 0) {
                    expect(response).toEqual(expect.any(EventError))
                }

                expect(handler).not.toHaveBeenCalled()

                for (const [i, _] of enumerate(Records)) {
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                        event: expect.any(EventError),
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', {
                        item: i,
                        response: undefined,
                    })

                    expect(ctx.logger.error).not.toHaveBeenCalled()

                    // it stops on the first error found
                    break
                }
            }
        )
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(SNSEvent), await context()), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockRejectedValue(error)
            const response = await handleSNSEvent(
                { sns: { schema: {}, handler, payloadType: 'binary' } },
                Records as SNSEventRecord[],
                ctx
            )

            if (Records.length > 0) {
                expect(response).toEqual(failure(error))
            }

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', {
                    item: i,
                    response: undefined,
                })

                expect(ctx.logger.error).not.toHaveBeenCalled()

                // it stops on the first error found
                break
            }
        })
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(SNSEvent), await context()), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleSNSEvent(
                { sns: { schema: {}, handler, payloadType: 'binary' } },
                Records as SNSEventRecord[],
                ctx
            )

            if (Records.length > 0) {
                expect(response).toEqual(failure(error))
            }

            for (const [i, record] of enumerate(Records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sns] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sns] sent', {
                    item: i,
                    response: undefined,
                })

                expect(ctx.logger.error).not.toHaveBeenCalled()

                // it stops on the first error found
                break
            }
        })
    })
})
