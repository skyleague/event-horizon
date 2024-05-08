import type { KinesisStreamBatchItemFailure } from 'aws-lambda'
import type { KinesisDataStreamRecord } from '../../../dev/aws/kinesis/kinesis.type.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../types.js'

export function kinesisErrorHandler({ logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        onError: (original: KinesisDataStreamRecord, error: Error | unknown): KinesisStreamBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.eventID }
        },
    }
}
