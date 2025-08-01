import type { S3BatchEventTask, S3BatchResultResult } from 'aws-lambda'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'
import type { LambdaContext } from '../../types.js'
import type { S3BatchHandler } from '../types.js'

export function s3BatchErrorHandler<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Result extends MaybeGenericParser,
>(
    handler: S3BatchHandler<Configuration, Service, Profile, Result>,
    { logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>,
) {
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
