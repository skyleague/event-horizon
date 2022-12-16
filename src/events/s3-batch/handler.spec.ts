import { handleS3Batch } from './handler'

import { EventError } from '../../errors'

import { array, asyncForAll, enumerate, isString, json, omit, random, tuple } from '@skyleague/axioms'
import { context, S3BatchEvent } from '@skyleague/event-horizon-dev'
import { arbitrary } from '@skyleague/therefore'

describe('handler', () => {
    test('events do not give failures', async () => {
        await asyncForAll(
            tuple(arbitrary(S3BatchEvent), await context({})).map(
                (xs) => [...xs, random(array(json(), { minLength: xs[0].tasks.length, maxLength: xs[0].tasks.length }))] as const
            ),
            async ([event, ctx, payloads]) => {
                ctx.mockClear()

                const handler = jest.fn()

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
                        taskId: event.tasks[i].taskId,
                    })),
                    treatMissingKeysAs: 'TemporaryFailure',
                })

                for (const [i, task] of enumerate(event.tasks)) {
                    expect(handler).toHaveBeenNthCalledWith(
                        i + 1,
                        expect.objectContaining({
                            raw: {
                                task: task,
                                job: omit(event, ['tasks']),
                            },
                        }),
                        ctx
                    )

                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                        event: expect.objectContaining({
                            raw: {
                                task: task,
                                job: omit(event, ['tasks']),
                            },
                        }),
                        item: i,
                    })
                    expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                        item: i,
                        response: {
                            resultCode: 'Succeeded',
                            resultString: isString(payloads[i]) ? payloads[i] : JSON.stringify(payloads[i]),
                            taskId: event.tasks[i].taskId,
                        },
                    })
                }

                expect(ctx.logger.error).not.toHaveBeenCalled()
            }
        )
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(S3BatchEvent), await context({})), async ([event, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockRejectedValue(error)

            const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

            expect(response).toEqual({
                invocationId: event.invocationId,
                invocationSchemaVersion: event.invocationSchemaVersion,
                results: event.tasks.map((_, i) => ({
                    resultCode: 'TemporaryFailure',
                    resultString: '',
                    taskId: event.tasks[i].taskId,
                })),
                treatMissingKeysAs: 'TemporaryFailure',
            })

            for (const [i, task] of enumerate(event.tasks)) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    expect.objectContaining({
                        raw: {
                            task: task,
                            job: omit(event, ['tasks']),
                        },
                    }),
                    ctx
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                    event: expect.objectContaining({
                        raw: {
                            task: task,
                            job: omit(event, ['tasks']),
                        },
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                    item: i,
                    response: {
                        resultCode: 'TemporaryFailure',
                        resultString: '',
                        taskId: event.tasks[i].taskId,
                    },
                })
            }
            if (event.tasks.length > 0) {
                expect(ctx.logger.error).toHaveBeenCalledWith('Uncaught error found', expect.any(EventError))
            }
        })
    })

    test.each([new Error(), EventError.badRequest(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
        await asyncForAll(tuple(arbitrary(S3BatchEvent), await context({})), async ([event, ctx]) => {
            ctx.mockClear()

            const handler = jest.fn().mockImplementation(() => {
                throw error
            })

            const response = await handleS3Batch({ s3Batch: { handler, schema: {} } }, event, ctx)

            expect(response).toEqual({
                invocationId: event.invocationId,
                invocationSchemaVersion: event.invocationSchemaVersion,
                results: event.tasks.map((_, i) => ({
                    resultCode: 'TemporaryFailure',
                    resultString: '',
                    taskId: event.tasks[i].taskId,
                })),
                treatMissingKeysAs: 'TemporaryFailure',
            })

            for (const [i, task] of enumerate(event.tasks)) {
                expect(handler).toHaveBeenNthCalledWith(
                    i + 1,
                    expect.objectContaining({
                        raw: {
                            task: task,
                            job: omit(event, ['tasks']),
                        },
                    }),
                    ctx
                )

                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 1, '[s3-batch] start', {
                    event: expect.objectContaining({
                        raw: {
                            task: task,
                            job: omit(event, ['tasks']),
                        },
                    }),
                    item: i,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2 * i + 2, '[s3-batch] sent', {
                    item: i,
                    response: {
                        resultCode: 'TemporaryFailure',
                        resultString: '',
                        taskId: event.tasks[i].taskId,
                    },
                })
            }
            if (event.tasks.length > 0) {
                expect(ctx.logger.error).toHaveBeenCalledWith('Uncaught error found', expect.any(EventError))
            }
        })
    })
})
