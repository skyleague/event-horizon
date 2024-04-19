import type { S3BatchTask } from '../types.js'

import type { S3BatchEventTask as AWSS3BatchEventTask, S3BatchEvent } from 'aws-lambda'

export function s3BatchParseEvent() {
    return {
        before: (event: S3BatchEvent, task: AWSS3BatchEventTask): S3BatchTask => {
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
