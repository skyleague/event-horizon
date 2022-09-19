import type { S3BatchEventTask } from '../../events/s3-batch'

import type { S3BatchEvent, S3BatchEventTask as AWSS3BatchEventTask } from 'aws-lambda'

export function s3BatchParseEvent() {
    return {
        before: (event: S3BatchEvent, task: AWSS3BatchEventTask): S3BatchEventTask => {
            return {
                taskId: task.taskId,
                s3Key: task.s3Key,
                s3VersionId: task.s3VersionId ?? undefined,
                s3BucketArn: task.s3BucketArn,
                raw: {
                    task,
                    job: {
                        invocationSchemaVersion: event.invocationSchemaVersion,
                        invocationId: event.invocationId,
                        job: { id: event.job.id },
                    },
                },
            }
        },
    }
}
