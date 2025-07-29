import type { SQSBatchItemFailure } from 'aws-lambda'
import type { SqsRecordSchema } from '../../../aws/sqs.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../types.js'

export function sqsErrorHandler({ logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        onError: (original: SqsRecordSchema, error: Error | unknown): SQSBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.messageId }
        },
    }
}
