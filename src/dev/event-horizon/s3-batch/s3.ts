import type { S3BatchHandler, S3BatchTask } from '../../../events/s3-batch/types.js'
import { S3BatchEvent, S3BatchEventTask } from '../../aws/s3-batch/s3.type.js'

import type { Dependent } from '@skyleague/axioms'
import { omit, tuple } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function s3BatchTask(
    _?: S3BatchHandler,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<S3BatchTask> {
    const task = arbitrary(S3BatchEventTask).constant(generation === 'fast')
    const event = arbitrary(S3BatchEvent).constant(generation === 'fast')
    return tuple(task, event).map(([t, e]) => ({
        taskId: t.taskId,
        s3Key: t.s3Key,
        s3VersionId: t.s3VersionId,
        s3BucketArn: t.s3BucketArn,
        raw: {
            task: task,
            job: omit(e, ['tasks']),
        },
    })) as unknown as Dependent<S3BatchTask>
}
