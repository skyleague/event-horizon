import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'

import type { KinesisStreamBatchItemFailure, KinesisStreamRecord } from 'aws-lambda'

export function kinesisErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: KinesisStreamRecord, error: Error | unknown): KinesisStreamBatchItemFailure => {
            const eventError = EventError.from(error)
            if (!isSensitive) {
                logger.error(`Uncaught error found`, eventError)
            }

            return { itemIdentifier: original.eventID }
        },
    }
}
