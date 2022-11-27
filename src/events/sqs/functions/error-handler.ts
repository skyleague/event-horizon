import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'

import { isError } from '@skyleague/axioms'
import type { SQSBatchItemFailure, SQSRecord } from 'aws-lambda'

export function sqsErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: SQSRecord, error: Error | unknown): SQSBatchItemFailure => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            if (!isSensitive) {
                logger.error(`Uncaught error found`, eventError)
            }

            return { itemIdentifier: original.messageId }
        },
    }
}
