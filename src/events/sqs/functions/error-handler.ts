import { EventError } from '../../../errors/event-error/index.js'
import type { LambdaContext } from '../../types.js'

import type { SQSBatchItemFailure, SQSRecord } from 'aws-lambda'

export function sqsErrorHandler({ logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        onError: (original: SQSRecord, error: Error | unknown): SQSBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.messageId }
        },
    }
}
