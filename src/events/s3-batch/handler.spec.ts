import { handleS3Batch } from './handler.js'

import { S3BatchEvent } from '../../aws/s3-batch/s3.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import { context } from '../../test/context/context.js'

import { array, asyncForAll, isString, json, omit, random, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'

it('events do not give failures', async () => {
    await asyncForAll(
        tuple(arbitrary(S3BatchEvent), await context({})).map(
            (xs) => [...xs, random(array(json(), { minLength: xs[0].tasks.length, maxLength: xs[0].tasks.length }))] as const,
        ),
        async ([event, ctx, payloads]) => {
            ctx.mockClear()

            const handler = vi.fn()

            for (const p of payloads) {
                handler.mockReturnValueOnce({
                    status: 'Succeeded',
                    payload: p,
                })
            }

            const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

            expect(response).toEqual({
                invocationId: event.invocationId,
                invocationSchemaVersion: event.invocationSchemaVersion,
                results: payloads.map((p, i) => ({
                    resultCode: 'Succeeded',
                    resultString: isString(p) ? p : JSON.stringify(p),
                    taskId: event.tasks[i]!.taskId,
                })),
                treatMissingKeysAs: 'TemporaryFailure',
            })

            for (const [i, task] of event.tasks.entries()) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    expect.objectContaining({
                        raw: {
                            task: task,
                            event: omit(event, ['tasks']),
                        },
                    }),
                    ctx,
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                    event: expect.objectContaining({
                        raw: {
                            task: task,
                            event: omit(event, ['tasks']),
                        },
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                    item: i,
                    response: {
                        resultCode: 'Succeeded',
                        resultString: isString(payloads[i]) ? payloads[i] : JSON.stringify(payloads[i]),
                        taskId: event.tasks[i]!.taskId,
                    },
                })
            }

            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it.each([new Error(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(S3BatchEvent), await context({})), async ([event, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)

        const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

        expect(response).toEqual({
            invocationId: event.invocationId,
            invocationSchemaVersion: event.invocationSchemaVersion,
            results: event.tasks.map((_, i) => ({
                resultCode: 'TemporaryFailure',
                resultString: '',
                taskId: event.tasks[i]!.taskId,
            })),
            treatMissingKeysAs: 'TemporaryFailure',
        })

        for (const [i, task] of event.tasks.entries()) {
            expect(handler).toHaveBeenNthCalledWith(
                i + 1,
                expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                ctx,
            )

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                event: expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                item: i,
                response: {
                    resultCode: 'TemporaryFailure',
                    resultString: '',
                    taskId: event.tasks[i]!.taskId,
                },
            })
        }
        if (event.tasks.length > 0) {
            expect(ctx.logger.error).toHaveBeenCalledWith(expect.any(String), expect.any(EventError))
        }
    })
})

it.each([EventError.badRequest()])('promise reject with client error, gives errors', async (error) => {
    await asyncForAll(tuple(arbitrary(S3BatchEvent), await context({})), async ([event, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockRejectedValue(error)

        const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

        expect(response).toEqual({
            invocationId: event.invocationId,
            invocationSchemaVersion: event.invocationSchemaVersion,
            results: event.tasks.map((_, i) => ({
                resultCode: 'TemporaryFailure',
                resultString: '',
                taskId: event.tasks[i]!.taskId,
            })),
            treatMissingKeysAs: 'TemporaryFailure',
        })

        for (const [i, task] of event.tasks.entries()) {
            expect(handler).toHaveBeenNthCalledWith(
                i + 1,
                expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                ctx,
            )

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                event: expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                item: i,
                response: {
                    resultCode: 'TemporaryFailure',
                    resultString: '',
                    taskId: event.tasks[i]!.taskId,
                },
            })
        }
        if (event.tasks.length > 0) {
            expect(ctx.logger.error).toHaveBeenCalledWith(expect.any(String), expect.any(EventError))
        }
    })
})

it.each([new Error(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
    await asyncForAll(tuple(arbitrary(S3BatchEvent), await context({})), async ([event, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })

        const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

        expect(response).toEqual({
            invocationId: event.invocationId,
            invocationSchemaVersion: event.invocationSchemaVersion,
            results: event.tasks.map((_, i) => ({
                resultCode: 'TemporaryFailure',
                resultString: '',
                taskId: event.tasks[i]!.taskId,
            })),
            treatMissingKeysAs: 'TemporaryFailure',
        })

        for (const [i, task] of event.tasks.entries()) {
            expect(handler).toHaveBeenNthCalledWith(
                i + 1,
                expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                ctx,
            )

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                event: expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                item: i,
                response: {
                    resultCode: 'TemporaryFailure',
                    resultString: '',
                    taskId: event.tasks[i]!.taskId,
                },
            })
        }
        if (event.tasks.length > 0) {
            expect(ctx.logger.error).toHaveBeenCalledWith(expect.any(String), expect.any(EventError))
        }
    })
})

it.each([EventError.badRequest()])('promise throws with client error, gives errors', async (error) => {
    await asyncForAll(tuple(arbitrary(S3BatchEvent), await context({})), async ([event, ctx]) => {
        ctx.mockClear()

        const handler = vi.fn().mockImplementation(() => {
            throw error
        })

        const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

        expect(response).toEqual({
            invocationId: event.invocationId,
            invocationSchemaVersion: event.invocationSchemaVersion,
            results: event.tasks.map((_, i) => ({
                resultCode: 'TemporaryFailure',
                resultString: '',
                taskId: event.tasks[i]!.taskId,
            })),
            treatMissingKeysAs: 'TemporaryFailure',
        })

        for (const [i, task] of event.tasks.entries()) {
            expect(handler).toHaveBeenNthCalledWith(
                i + 1,
                expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                ctx,
            )

            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                event: expect.objectContaining({
                    raw: {
                        task: task,
                        event: omit(event, ['tasks']),
                    },
                }),
                item: i,
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                item: i,
                response: {
                    resultCode: 'TemporaryFailure',
                    resultString: '',
                    taskId: event.tasks[i]!.taskId,
                },
            })
        }
        if (event.tasks.length > 0) {
            expect(ctx.logger.error).toHaveBeenCalledWith(expect.any(String), expect.any(EventError))
        }
    })
})
