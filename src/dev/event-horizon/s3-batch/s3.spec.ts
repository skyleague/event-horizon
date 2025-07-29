import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { s3BatchEventTask } from '../../../aws/s3-batch/s3.schema.js'
import { s3BatchHandler } from '../../../events/s3-batch/s3-batch.js'
import type { S3BatchTask } from '../../../events/s3-batch/types.js'
import { s3BatchTask } from './s3.js'

it('should properly validate and type S3 event payload', () => {
    forAll(
        s3BatchTask(
            s3BatchHandler({
                s3Batch: {
                    schema: {
                        result: z.literal('result'),
                    },
                    handler: (event) => {
                        expectTypeOf(event).toEqualTypeOf<S3BatchTask>()

                        return {
                            status: 'Succeeded',
                            payload: 'result' as const,
                        }
                    },
                },
            }),
        ),
        (request) => {
            expect(request.taskId).toBeDefined()
            expect(request.s3Key).toBeDefined()
            // expect(request.s3VersionId).toBeDefined()
            expect(request.s3BucketArn).toBeDefined()

            expect(request.raw.task.taskId).toEqual(request.taskId)
            expect(request.raw.task.s3Key).toEqual(request.s3Key)
            expect(request.raw.task.s3VersionId).toEqual(request.s3VersionId ?? null)
            expect(request.raw.task.s3BucketArn).toEqual(request.s3BucketArn)
            s3BatchEventTask.parse(request.raw.task)
        },
    )
})
