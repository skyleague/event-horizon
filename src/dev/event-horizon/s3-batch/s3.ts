import type { Dependent } from '@skyleague/axioms'
import { omit, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { s3BatchEvent, s3BatchEventTask } from '../../../aws/s3-batch/s3.schema.js'
import type { S3BatchHandler, S3BatchTask } from '../../../events/s3-batch/types.js'

export function s3BatchTask(
    _?: S3BatchHandler,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<S3BatchTask> {
    const task = arbitrary(s3BatchEventTask).constant(generation === 'fast')
    const event = arbitrary(s3BatchEvent).constant(generation === 'fast')
    return tuple(task, event).map(([t, e]) => ({
        taskId: t.taskId,
        s3Key: t.s3Key,
        s3VersionId: t.s3VersionId ?? undefined,
        s3BucketArn: t.s3BucketArn,
        raw: {
            task: t,
            event: omit(e, ['tasks']),
        },
    }))
}
