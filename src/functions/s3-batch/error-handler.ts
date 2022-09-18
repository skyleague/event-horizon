import { EventError } from '../../errors/event-error'
import type { S3BatchHandler } from '../../events/s3-batch'
import type { LambdaContext } from '../../events/types'

import { isError } from '@skyleague/axioms'
import type { S3BatchEventTask, S3BatchResultResult } from 'aws-lambda'

export function s3BatchErrorHandler(handler: S3BatchHandler, { logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: S3BatchEventTask, error: Error | unknown): S3BatchResultResult => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            if (!isSensitive) {
                logger.error(`Uncaught error found`, eventError)
            }
            // https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops-invoke-lambda.html
            // result strings on failure are ignored
            return { taskId: original.taskId, resultCode: handler.s3Batch.treatErrorsAs ?? 'TemporaryFailure', resultString: '' }
        },
    }
}
