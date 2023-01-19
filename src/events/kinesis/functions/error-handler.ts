import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'

import type { KinesisStreamBatchItemFailure, KinesisStreamRecord } from 'aws-lambda'

export function kinesisErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: KinesisStreamRecord, error: Error | unknown): KinesisStreamBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.eventID }
        },
    }
}
