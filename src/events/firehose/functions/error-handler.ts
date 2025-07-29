import type { FirehoseTransformationResultRecord } from 'aws-lambda'
import type { KinesisFirehoseRecord } from '../../../aws/firehose.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../types.js'

export function firehoseErrorHandler({ logger, isSensitive }: LambdaContext): {
    onError: (original: KinesisFirehoseRecord, error: Error | unknown) => FirehoseTransformationResultRecord
} {
    return {
        onError: (original: KinesisFirehoseRecord, error: Error | unknown): FirehoseTransformationResultRecord => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return {
                recordId: original.recordId,
                result: 'ProcessingFailed',
                data: original.data,
            }
        },
    }
}
