import { handleFirehoseTransformation } from './handler.js'

import { asyncForAll, enumerate, isString, json, random, tuple } from '@skyleague/axioms'
import type { JsonValue } from '@skyleague/axioms/types'
import { arbitrary } from '@skyleague/therefore'
import type { FirehoseTransformationEventRecord } from 'aws-lambda/trigger/kinesis-firehose-transformation.js'
import { expect, it, vi } from 'vitest'
import { alwaysTrueSchema, neverTrueSchema } from '../../../test/schema.js'
import { FirehoseTransformationEvent } from '../../dev/aws/firehose/firehose.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import { context } from '../../test/context/context.js'

it('binary events does not give failures', async () => {
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEvent), await context()).map(([e, ctx]) => {
            const results: JsonValue[] = []
            for (const record of e.records) {
                record.data = Buffer.from(record.data).toString('base64')
                results.push(random(json()))
            }
            return [e, ctx, results] as const
        }),
        async ([{ records }, ctx, results]) => {
            ctx.mockClear()

            const handler = vi.fn()
            for (const result of results) {
                handler.mockResolvedValueOnce({
                    status: 'Ok',
                    payload: result,
                })
            }

            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler, payloadType: 'binary' } },
                records as FirehoseTransformationEventRecord[],
                ctx,
            )

            expect(response).toEqual({
                records: results.map((r, i) => ({
                    data: Buffer.from(isString(r) ? r : JSON.stringify(r)).toString('base64'),
                    recordId: records[i]!.recordId,
                    result: 'Ok',
                })),
            })

            for (const [i, record] of enumerate(records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                    item: i,
                    response: undefined,
                })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('plaintext events does not give failures', async () => {
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEvent), await context()).map(([e, ctx]) => {
            const results: JsonValue[] = []
            for (const record of e.records) {
                record.data = Buffer.from(record.data).toString('base64')
                results.push(random(json()))
            }
            return [e, ctx, results] as const
        }),
        async ([{ records }, ctx, results]) => {
            ctx.mockClear()

            const handler = vi.fn()
            for (const result of results) {
                handler.mockResolvedValueOnce({
                    status: 'Ok',
                    payload: result,
                })
            }
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler, payloadType: 'plaintext' } },
                records as FirehoseTransformationEventRecord[],
                ctx,
            )

            expect(response).toEqual({
                records: results.map((r, i) => ({
                    data: Buffer.from(isString(r) ? r : JSON.stringify(r)).toString('base64'),
                    recordId: records[i]!.recordId,
                    result: 'Ok',
                })),
            })

            for (const [i, record] of enumerate(records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                    item: i,
                    response: undefined,
                })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('json events does not give failures', async () => {
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEvent), await context()).map(([e, ctx]) => {
            const results: JsonValue[] = []
            for (const record of e.records) {
                record.data = Buffer.from(JSON.stringify(random(json()))).toString('base64')
                results.push(random(json()))
            }
            return [e, ctx, results] as const
        }),
        async ([{ records }, ctx, results]) => {
            ctx.mockClear()

            const handler = vi.fn()
            for (const result of results) {
                handler.mockResolvedValueOnce({
                    status: 'Ok',
                    payload: result,
                })
            }
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler } },
                records as FirehoseTransformationEventRecord[],
                ctx,
            )

            expect(response).toEqual({
                records: results.map((r, i) => ({
                    data: Buffer.from(isString(r) ? r : JSON.stringify(r)).toString('base64'),
                    recordId: records[i]!.recordId,
                    result: 'Ok',
                })),
            })

            for (const [i, record] of enumerate(records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                    event: expect.objectContaining({
                        raw: record,
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                    item: i,
                    response: undefined,
                })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('json parse failure, gives failure', async () => {
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEvent), await context()).map(([e, ctx]) => {
            const results: JsonValue[] = []
            for (const record of e.records) {
                record.data = Buffer.from(`${JSON.stringify(random(json()))}{`).toString('base64')
                results.push(random(json()))
            }
            return [e, ctx, results] as const
        }),
        async ([{ records }, ctx, results]) => {
            ctx.mockClear()

            const handler = vi.fn()
            for (const result of results) {
                handler.mockResolvedValueOnce({
                    status: 'Ok',
                    payload: result,
                })
            }
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler } },
                records as FirehoseTransformationEventRecord[],
                ctx,
            )

            expect(response).toEqual({
                records: results.map((_, i) => ({
                    data: records[i]!.data,
                    recordId: records[i]!.recordId,
                    result: 'ProcessingFailed',
                })),
            })

            expect(handler).not.toHaveBeenCalled()

            for (const [i, _] of enumerate(records)) {
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                    event: expect.any(SyntaxError),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                    item: i,
                    response: undefined,
                })
                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
            }
        },
    )
})

it('payload schema validation, gives failure', async () => {
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
            const results: JsonValue[] = []
            for (const record of e.records) {
                record.data = Buffer.from(JSON.stringify(random(json()))).toString('base64')
                results.push(random(json()))
            }
            return [e, ctx, results] as const
        }),
        async ([{ records }, ctx, results]) => {
            ctx.mockClear()

            const handler = vi.fn()
            for (const result of results) {
                handler.mockResolvedValueOnce({
                    status: 'Ok',
                    payload: result,
                })
            }
            const response = await handleFirehoseTransformation(
                { firehose: { schema: { payload: neverTrueSchema }, handler } },
                records as FirehoseTransformationEventRecord[],
                ctx,
            )

            expect(response).toEqual({
                records: results.map((_r, i) => ({
                    data: records[i]!.data,
                    recordId: records[i]!.recordId,
                    result: 'ProcessingFailed',
                })),
            })

            expect(handler).not.toHaveBeenCalled()

            for (const [i, _] of enumerate(records)) {
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                    event: expect.any(EventError),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                    item: i,
                    response: undefined,
                })

                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), EventError.validation())
            }
        },
    )
})

it('result schema validation, gives failure', async () => {
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
            const results: JsonValue[] = []
            for (const record of e.records) {
                record.data = Buffer.from(JSON.stringify(random(json()))).toString('base64')
                results.push(random(json()))
            }
            return [e, ctx, results] as const
        }),
        async ([{ records }, ctx, results]) => {
            ctx.mockClear()

            const handler = vi.fn()
            for (const result of results) {
                handler.mockResolvedValueOnce({
                    status: 'Ok',
                    payload: result,
                })
            }
            const response = await handleFirehoseTransformation(
                { firehose: { schema: { payload: alwaysTrueSchema, result: neverTrueSchema }, handler } },
                records as FirehoseTransformationEventRecord[],
                ctx,
            )

            expect(response).toEqual({
                records: results.map((_r, i) => ({
                    data: records[i]!.data,
                    recordId: records[i]!.recordId,
                    result: 'ProcessingFailed',
                })),
            })

            for (const [i, record] of enumerate(records)) {
                expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                    event: expect.objectContaining({ raw: record }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                    item: i,
                    response: undefined,
                })

                expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), EventError.validation())
            }
        },
    )
})

it.each([new Error(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
        const response = await handleFirehoseTransformation(
            { firehose: { schema: {}, handler, payloadType: 'binary' } },
            records as FirehoseTransformationEventRecord[],
            ctx,
        )

        expect(response).toEqual({
            records: records.map((r) => ({
                data: r.data,
                recordId: r.recordId,
                result: 'ProcessingFailed',
            })),
        })

        for (const [i, record] of enumerate(records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                item: i,
                response: undefined,
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})

it.each([EventError.badRequest()])('promise reject with client error, gives errors', async (error) => {
    await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)
        const response = await handleFirehoseTransformation(
            { firehose: { schema: {}, handler, payloadType: 'binary' } },
            records as FirehoseTransformationEventRecord[],
            ctx,
        )

        expect(response).toEqual({
            records: records.map((r) => ({
                data: r.data,
                recordId: r.recordId,
                result: 'ProcessingFailed',
            })),
        })

        for (const [i, record] of enumerate(records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                item: i,
                response: undefined,
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})

it.each([new Error(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleFirehoseTransformation(
            { firehose: { schema: {}, handler, payloadType: 'binary' } },
            records as FirehoseTransformationEventRecord[],
            ctx,
        )

        expect(response).toEqual({
            records: records.map((r) => ({
                data: r.data,
                recordId: r.recordId,
                result: 'ProcessingFailed',
            })),
        })

        for (const [i, record] of enumerate(records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                item: i,
                response: undefined,
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})

it.each([EventError.badRequest()])('promise throws with client error, gives errors', async (error) => {
    await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })
        const response = await handleFirehoseTransformation(
            { firehose: { schema: {}, handler, payloadType: 'binary' } },
            records as FirehoseTransformationEventRecord[],
            ctx,
        )

        expect(response).toEqual({
            records: records.map((r) => ({
                data: r.data,
                recordId: r.recordId,
                result: 'ProcessingFailed',
            })),
        })

        for (const [i, record] of enumerate(records)) {
            expect(handler).toHaveBeenNthCalledWith(i + 1, expect.objectContaining({ raw: record }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[firehose] start', {
                event: expect.objectContaining({
                    raw: record,
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[firehose] sent', {
                item: i,
                response: undefined,
            })
            expect(ctx.logger.error).toHaveBeenNthCalledWith(i + 1, expect.any(String), expect.any(EventError))
        }
    })
})
