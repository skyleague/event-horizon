import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'
import type { S3BatchHandler } from '../types'

import type { S3BatchEventTask, S3BatchResultResult } from 'aws-lambda'

export function s3BatchErrorHandler(handler: S3BatchHandler, { logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: S3BatchEventTask, error: Error | unknown): S3BatchResultResult => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }
            // https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops-invoke-lambda.html
            // result strings on failure are ignored
            return { taskId: original.taskId, resultCode: handler.s3Batch.treatErrorsAs ?? 'TemporaryFailure', resultString: '' }
        },
    }
}
