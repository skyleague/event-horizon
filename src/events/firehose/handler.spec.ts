import { handleFirehoseTransformation } from './handler'

import { EventError } from '../../errors/event-error'

import type { Json } from '@skyleague/axioms'
import { asyncForAll, enumerate, isString, json, random, tuple } from '@skyleague/axioms'
import { context, FirehoseTransformationEvent } from '@skyleague/event-horizon-dev'
import type { Schema } from '@skyleague/therefore'
import { arbitrary } from '@skyleague/therefore'
import type { FirehoseTransformationEventRecord } from 'aws-lambda/trigger/kinesis-firehose-transformation'

describe('handler', () => {
    const neverTrue = {
        is: () => false,
        errors: [],
    } as unknown as Schema<string>

    const alwaysTrue = {
        is: () => true,
        errors: [],
    } as unknown as Schema<string>

    test('binary events does not give failures', async () => {
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
                const results: Json[] = []
                for (const record of e.records) {
                    record.data = Buffer.from(record.data).toString('base64')
                    results.push(random(json()))
                }
                return [e, ctx, results] as const
            }),
            async ([{ records }, ctx, results]) => {
                ctx.mockClear()

                const handler = jest.fn()
                for (const result of results) {
                    handler.mockResolvedValueOnce({
                        status: 'Ok',
                        payload: result,
                    })
                }

                const response = await handleFirehoseTransformation(
                    { firehose: { schema: {}, handler, payloadType: 'binary' } },
                    records as FirehoseTransformationEventRecord[],
                    ctx
                )

                expect(response).toEqual({
                    records: results.map((r, i) => ({
                        data: Buffer.from(isString(r) ? r : JSON.stringify(r)).toString('base64'),
                        recordId: records[i].recordId,
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
            }
        )
    })

    test('plaintext events does not give failures', async () => {
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
                const results: Json[] = []
                for (const record of e.records) {
                    record.data = Buffer.from(record.data).toString('base64')
                    results.push(random(json()))
                }
                return [e, ctx, results] as const
            }),
            async ([{ records }, ctx, results]) => {
                ctx.mockClear()

                const handler = jest.fn()
                for (const result of results) {
                    handler.mockResolvedValueOnce({
                        status: 'Ok',
                        payload: result,
                    })
                }
                const response = await handleFirehoseTransformation(
                    { firehose: { schema: {}, handler, payloadType: 'plaintext' } },
                    records as FirehoseTransformationEventRecord[],
                    ctx
                )

                expect(response).toEqual({
                    records: results.map((r, i) => ({
                        data: Buffer.from(isString(r) ? r : JSON.stringify(r)).toString('base64'),
                        recordId: records[i].recordId,
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
            }
        )
    })

    test('json events does not give failures', async () => {
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
                const results: Json[] = []
                for (const record of e.records) {
                    record.data = Buffer.from(JSON.stringify(random(json()))).toString('base64')
                    results.push(random(json()))
                }
                return [e, ctx, results] as const
            }),
            async ([{ records }, ctx, results]) => {
                ctx.mockClear()

                const handler = jest.fn()
                for (const result of results) {
                    handler.mockResolvedValueOnce({
                        status: 'Ok',
                        payload: result,
                    })
                }
                const response = await handleFirehoseTransformation(
                    { firehose: { schema: {}, handler } },
                    records as FirehoseTransformationEventRecord[],
                    ctx
                )

                expect(response).toEqual({
                    records: results.map((r, i) => ({
                        data: Buffer.from(isString(r) ? r : JSON.stringify(r)).toString('base64'),
                        recordId: records[i].recordId,
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
            }
        )
    })

    test('json parse failure, gives failure', async () => {
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
                const results: Json[] = []
                for (const record of e.records) {
                    record.data = Buffer.from(`${JSON.stringify(random(json()))}{`).toString('base64')
                    results.push(random(json()))
                }
                return [e, ctx, results] as const
            }),
            async ([{ records }, ctx, results]) => {
                ctx.mockClear()

                const handler = jest.fn()
                for (const result of results) {
                    handler.mockResolvedValueOnce({
                        status: 'Ok',
                        payload: result,
                    })
                }
                const response = await handleFirehoseTransformation(
                    { firehose: { schema: {}, handler } },
                    records as FirehoseTransformationEventRecord[],
                    ctx
                )

                expect(response).toEqual({
                    records: results.map((r, i) => ({
                        data: records[i].data,
                        recordId: records[i].recordId,
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
            }
        )
    })

    test('payload schema validation, gives failure', async () => {
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
                const results: Json[] = []
                for (const record of e.records) {
                    record.data = Buffer.from(JSON.stringify(random(json()))).toString('base64')
                    results.push(random(json()))
                }
                return [e, ctx, results] as const
            }),
            async ([{ records }, ctx, results]) => {
                ctx.mockClear()

                const handler = jest.fn()
                for (const result of results) {
                    handler.mockResolvedValueOnce({
                        status: 'Ok',
                        payload: result,
                    })
                }
                const response = await handleFirehoseTransformation(
                    { firehose: { schema: { payload: neverTrue }, handler } },
                    records as FirehoseTransformationEventRecord[],
                    ctx
                )

                expect(response).toEqual({
                    records: results.map((r, i) => ({
                        data: records[i].data,
                        recordId: records[i].recordId,
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
            }
        )
    })

    test('result schema validation, gives failure', async () => {
        await asyncForAll(
            tuple(arbitrary(FirehoseTransformationEvent), await context({})).map(([e, ctx]) => {
                const results: Json[] = []
                for (const record of e.records) {
                    record.data = Buffer.from(JSON.stringify(random(json()))).toString('base64')
                    results.push(random(json()))
                }
                return [e, ctx, results] as const
            }),
            async ([{ records }, ctx, results]) => {
                ctx.mockClear()

                const handler = jest.fn()
                for (const result of results) {
                    handler.mockResolvedValueOnce({
                        status: 'Ok',
                        payload: result,
                    })
                }
                const response = await handleFirehoseTransformation(
                    { firehose: { schema: { payload: alwaysTrue, result: neverTrue }, handler } },
                    records as FirehoseTransformationEventRecord[],
                    ctx
                )

                expect(response).toEqual({
                    records: results.map((r, i) => ({
                        data: records[i].data,
                        recordId: records[i].recordId,
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
            }
        )
    })

    test.each([new Error(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockRejectedValue(error)
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler, payloadType: 'binary' } },
                records as FirehoseTransformationEventRecord[],
                ctx
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

    test.each([EventError.badRequest()])('promise reject with client error, gives errors', async (error) => {
        await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockRejectedValue(error)
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler, payloadType: 'binary' } },
                records as FirehoseTransformationEventRecord[],
                ctx
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

    test.each([new Error(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler, payloadType: 'binary' } },
                records as FirehoseTransformationEventRecord[],
                ctx
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

    test.each([EventError.badRequest()])('promise throws with client error, gives errors', async (error) => {
        await asyncForAll(tuple(arbitrary(FirehoseTransformationEvent), await context({})), async ([{ records }, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })
            const response = await handleFirehoseTransformation(
                { firehose: { schema: {}, handler, payloadType: 'binary' } },
                records as FirehoseTransformationEventRecord[],
                ctx
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
})
