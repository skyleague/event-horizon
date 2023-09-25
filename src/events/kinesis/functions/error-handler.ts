import { EventError } from '../../../errors/event-error/index.js'
import type { LambdaContext } from '../../types.js'

import type { KinesisStreamBatchItemFailure, KinesisStreamRecord } from 'aws-lambda'

export function kinesisErrorHandler({ logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        onError: (original: KinesisStreamRecord, error: Error | unknown): KinesisStreamBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.eventID }
        },
    }
}
