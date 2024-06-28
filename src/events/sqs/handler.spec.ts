import { handleSQSEvent, handleSQSMessageGroup } from './handler.js'
import type { SQSMessageGroup } from './types.js'

import { type SqsRecordSchema, SqsSchema } from '../../dev/aws/sqs/sqs.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { Logger } from '../../observability/logger/logger.js'
import { context } from '../../test/context/context.js'

import { asyncForAll, groupBy, isFailure, json, map, random, tuple } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import { arbitrary } from '@skyleague/therefore'
import type { SQSBatchItemFailure, SQSBatchResponse } from 'aws-lambda/trigger/sqs.js'
import { describe, expect, it, vi } from 'vitest'

// biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
function handleMessageGroup({ records }: SQSMessageGroup, { logger }: { logger: Logger }): SQSBatchItemFailure[] | void {
    for (const record of records) {
        if (isFailure(record.payload)) {
            logger.error('error', EventError.from(record.payload))
        }
    }
    const failures = records
        .filter((r) => isFailure(r.payload))
        .map((r): SQSBatchResponse['batchItemFailures'][number] => ({ itemIdentifier: r.raw.messageId }))

    if (failures.length > 0) {
        return failures
    }
}

describe('plaintext events does not give failures', () => {
    it('handleSQSEvent', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn()
            const response = await handleSQSEvent(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            expect(response).toEqual(undefined)

            for (const [i, record] of Records.entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    expect.objectContaining({ raw: record, payload: expect.any(String) }),
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: expect.objectContaining({ raw: record, payload: expect.any(String) }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', { item: i, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })

    it('handleSQSMessageGroup', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockImplementation(handleMessageGroup)
            const response = await handleSQSMessageGroup(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            expect(response).toEqual(undefined)

            const groups = groupBy(
                map(Records.entries(), ([item, record]) => ({ item, record })),
                (x) => x.record.attributes.MessageGroupId ?? 'unknown',
            )
            for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    {
                        messageGroupId,
                        records: records.map((r) =>
                            expect.objectContaining({ item: r.item, payload: expect.any(String), raw: r.record }),
                        ),
                    },
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: {
                        messageGroupId,
                        records: records.map((r) =>
                            expect.objectContaining({ item: r.item, payload: expect.any(String), raw: r.record }),
                        ),
                    },
                    messageGroupId,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', { messageGroupId, response: undefined })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        })
    })
})

describe('json events does not give failures', () => {
    it('handleSQSEvent', async () => {
        await asyncForAll(
            tuple(arbitrary(SqsSchema), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.body = JSON.stringify(random(json({})))
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = vi.fn()
                const response = await handleSQSEvent({ sqs: { schema: {}, handler } }, Records as SqsRecordSchema[], ctx)

                expect(response).toEqual(undefined)

                for (const [i, record] of Records.entries()) {
                    expect(handler).toHaveBeenNthCalledWith(
                        i + 1,
                        expect.objectContaining({ raw: record, payload: expect.any(Object) }),
                        ctx,
                    )

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                        event: expect.objectContaining({ raw: record, payload: expect.any(Object) }),
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', { item: i, response: undefined })
                }

                expect(ctx.logger.error).not.toHaveBeenCalled()
            },
        )
    })

    it('handleSQSMessageGroup', async () => {
        await asyncForAll(
            tuple(arbitrary(SqsSchema), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.body = JSON.stringify(random(json({})))
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = vi.fn().mockImplementation(handleMessageGroup)
                const response = await handleSQSMessageGroup({ sqs: { schema: {}, handler } }, Records as SqsRecordSchema[], ctx)

                expect(response).toEqual(undefined)

                const groups = groupBy(
                    map(Records.entries(), ([item, record]) => ({ item, record })),
                    (x) => x.record.attributes.MessageGroupId ?? 'unknown',
                )
                for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                    expect(handler).toHaveBeenNthCalledWith(
                        i + 1,
                        {
                            messageGroupId,
                            records: records.map((r) =>
                                expect.objectContaining({ item: r.item, payload: expect.any(Object), raw: r.record }),
                            ),
                        },
                        ctx,
                    )

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                        event: {
                            messageGroupId,
                            records: records.map((r) =>
                                expect.objectContaining({ item: r.item, payload: expect.any(Object), raw: r.record }),
                            ),
                        },
                        messageGroupId,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                        messageGroupId,
                        response: undefined,
                    })
                }

                expect(ctx.logger.error).not.toHaveBeenCalled()
            },
        )
    })
})

describe('json parse failure, gives failure', () => {
    it('handleSQSEvent', async () => {
        await asyncForAll(
            tuple(arbitrary(SqsSchema), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.body = `${JSON.stringify(random(json({})))}{`
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = vi.fn()
                const response = await handleSQSEvent({ sqs: { schema: {}, handler } }, Records as SqsRecordSchema[], ctx)

                if (Records.length > 0) {
                    expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
                }

                expect(handler).not.toHaveBeenCalled()

                expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
                for (const [i, record] of Records.entries()) {
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
            },
        )
    })
    it('handleSQSMessageGroup', async () => {
        await asyncForAll(
            tuple(arbitrary(SqsSchema), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.body = `${JSON.stringify(random(json({})))}{`
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = vi.fn().mockImplementation(handleMessageGroup)
                const response = await handleSQSMessageGroup({ sqs: { schema: {}, handler } }, Records as SqsRecordSchema[], ctx)

                const groups = groupBy(
                    map(Records.entries(), ([item, record]) => ({ item, record })),
                    (x) => x.record.attributes.MessageGroupId ?? 'unknown',
                )

                if (Records.length > 0) {
                    expect(response).toEqual({
                        batchItemFailures: Object.values(groups).flatMap((rs) =>
                            rs.map((r) => ({ itemIdentifier: r.record.messageId })),
                        ),
                    })
                }

                for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                    expect(handler).toHaveBeenNthCalledWith(
                        i + 1,
                        {
                            messageGroupId,
                            records: records.map((r) =>
                                expect.objectContaining({ item: r.item, payload: expect.any(SyntaxError), raw: r.record }),
                            ),
                        },
                        ctx,
                    )

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                        event: {
                            messageGroupId,
                            records: records.map((r) =>
                                expect.objectContaining({ item: r.item, payload: expect.any(SyntaxError), raw: r.record }),
                            ),
                        },
                        messageGroupId,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                        messageGroupId,
                        response: records.map((r) => ({ itemIdentifier: r.record.messageId })),
                    })
                }

                expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
                for (const [i, _] of Records.entries()) {
                    expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
                }
            },
        )
    })
})

describe('schema validation, gives failure', () => {
    it('handleSQSEvent', async () => {
        const neverTrue = {
            is: () => false,
            errors: [],
        } as unknown as Schema<string>
        await asyncForAll(
            tuple(arbitrary(SqsSchema), await context({})).map(([e, ctx]) => {
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
                    Records as SqsRecordSchema[],
                    ctx,
                )

                if (Records.length > 0) {
                    expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
                }

                expect(handler).not.toHaveBeenCalled()

                for (const [i, record] of Records.entries()) {
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
            },
        )
    })
    it('handleSQSMessageGroup', async () => {
        const neverTrue = {
            is: () => false,
            errors: [],
        } as unknown as Schema<string>
        await asyncForAll(
            tuple(arbitrary(SqsSchema), await context({})).map(([e, ctx]) => {
                for (const record of e.Records) {
                    record.body = JSON.stringify(random(json({})))
                }
                return [e, ctx] as const
            }),
            async ([{ Records }, ctx]) => {
                ctx.mockClear()

                const handler = vi.fn().mockImplementation(handleMessageGroup)
                const response = await handleSQSMessageGroup(
                    { sqs: { schema: { payload: neverTrue }, handler } },
                    Records as SqsRecordSchema[],
                    ctx,
                )

                const groups = groupBy(
                    map(Records.entries(), ([item, record]) => ({ item, record })),
                    (x) => x.record.attributes.MessageGroupId ?? 'unknown',
                )

                if (Records.length > 0) {
                    expect(response).toEqual({
                        batchItemFailures: Object.values(groups).flatMap((rs) =>
                            rs.map((r) => ({ itemIdentifier: r.record.messageId })),
                        ),
                    })
                }

                for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                    expect(handler).toHaveBeenNthCalledWith(
                        i + 1,
                        {
                            messageGroupId,
                            records: records.map((r) =>
                                expect.objectContaining({ item: r.item, payload: expect.any(EventError), raw: r.record }),
                            ),
                        },
                        ctx,
                    )

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                        event: {
                            messageGroupId,
                            records: records.map((r) =>
                                expect.objectContaining({ item: r.item, payload: expect.any(EventError), raw: r.record }),
                            ),
                        },
                        messageGroupId,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                        messageGroupId,
                        response: records.map((r) => ({ itemIdentifier: r.record.messageId })),
                    })
                }

                expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
                for (const [i, _] of Records.entries()) {
                    expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), EventError.validation())
                }
            },
        )
    })
})

describe.each([new Error(), 'foobar'])('promise reject with Error, gives failure', (error) => {
    it('handleSQSEvent', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockRejectedValue(error)
            const response = await handleSQSEvent(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, record] of Records.entries()) {
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
    it('handleSQSMessageGroup', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockRejectedValue(error)
            const response = await handleSQSMessageGroup(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            const groups = groupBy(
                map(Records.entries(), ([item, record]) => ({ item, record })),
                (x) => x.record.attributes.MessageGroupId ?? 'unknown',
            )

            if (Records.length > 0) {
                expect(response).toEqual({
                    batchItemFailures: Object.values(groups).flatMap((rs) =>
                        rs.map((r) => ({ itemIdentifier: r.record.messageId })),
                    ),
                })
            }

            for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    messageGroupId,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                    messageGroupId,
                    response: records.map((r) => ({ itemIdentifier: r.record.messageId })),
                })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, _] of Records.entries()) {
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
            }
        })
    })
})

describe.each([EventError.badRequest()])('promise reject with error error, gives errors', (error) => {
    it('handleSQSEvent', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockRejectedValue(error)
            const response = await handleSQSEvent(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, record] of Records.entries()) {
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
    it('handleSQSMessageGroup', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockRejectedValue(error)
            const response = await handleSQSMessageGroup(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            const groups = groupBy(
                map(Records.entries(), ([item, record]) => ({ item, record })),
                (x) => x.record.attributes.MessageGroupId ?? 'unknown',
            )

            if (Records.length > 0) {
                expect(response).toEqual({
                    batchItemFailures: Object.values(groups).flatMap((rs) =>
                        rs.map((r) => ({ itemIdentifier: r.record.messageId })),
                    ),
                })
            }

            for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    messageGroupId,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                    messageGroupId,
                    response: records.map((r) => ({ itemIdentifier: r.record.messageId })),
                })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, _] of Records.entries()) {
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
            }
        })
    })
})

describe.each([new Error(), 'foobar'])('promise throws with Error, gives failure', (error) => {
    it('handleSQSEvent', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleSQSEvent(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, record] of Records.entries()) {
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
    it('handleSQSMessageGroup', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleSQSMessageGroup(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            const groups = groupBy(
                map(Records.entries(), ([item, record]) => ({ item, record })),
                (x) => x.record.attributes.MessageGroupId ?? 'unknown',
            )

            if (Records.length > 0) {
                expect(response).toEqual({
                    batchItemFailures: Object.values(groups).flatMap((rs) =>
                        rs.map((r) => ({ itemIdentifier: r.record.messageId })),
                    ),
                })
            }

            for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    messageGroupId,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                    messageGroupId,
                    response: records.map((r) => ({ itemIdentifier: r.record.messageId })),
                })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, _] of Records.entries()) {
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
            }
        })
    })
})

describe.each([EventError.badRequest()])('promise throws with client error, gives errors', (error) => {
    it('handleSQSEvent', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleSQSEvent(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            if (Records.length > 0) {
                expect(response).toEqual({ batchItemFailures: Records.map((r) => ({ itemIdentifier: r.messageId })) })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, record] of Records.entries()) {
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

    it('handleSQSMessageGroup', async () => {
        await asyncForAll(tuple(arbitrary(SqsSchema), await context({})), async ([{ Records }, ctx]) => {
            ctx.mockClear()

            const handler = vi.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleSQSMessageGroup(
                { sqs: { schema: {}, handler, payloadType: 'plaintext' } },
                Records as SqsRecordSchema[],
                ctx,
            )

            const groups = groupBy(
                map(Records.entries(), ([item, record]) => ({ item, record })),
                (x) => x.record.attributes.MessageGroupId ?? 'unknown',
            )

            if (Records.length > 0) {
                expect(response).toEqual({
                    batchItemFailures: Object.values(groups).flatMap((rs) =>
                        rs.map((r) => ({ itemIdentifier: r.record.messageId })),
                    ),
                })
            }

            for (const [i, [messageGroupId, records]] of Object.entries(groups).entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[sqs] start', {
                    event: {
                        messageGroupId,
                        records: records.map((r) => expect.objectContaining({ item: r.item, raw: r.record })),
                    },
                    messageGroupId,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[sqs] sent', {
                    messageGroupId,
                    response: records.map((r) => ({ itemIdentifier: r.record.messageId })),
                })
            }

            expect(ctx.logger.error).toHaveBeenCalledTimes(Records.length)
            for (const [i, _] of Records.entries()) {
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, EventError.from(error).message, expect.any(EventError))
            }
        })
    })
})
