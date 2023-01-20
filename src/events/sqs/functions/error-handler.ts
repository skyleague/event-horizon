import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'

import type { SQSBatchItemFailure, SQSRecord } from 'aws-lambda'

export function sqsErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: SQSRecord, error: Error | unknown): SQSBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.messageId }
        },
    }
}
