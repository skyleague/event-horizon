import { EventError } from '../../../errors/event-error/index.js'
import type { LambdaContext } from '../../types.js'

import type { FirehoseTransformationEventRecord, FirehoseTransformationResultRecord } from 'aws-lambda'

export function firehoseErrorHandler({ logger, isSensitive }: LambdaContext): {
    onError: (original: FirehoseTransformationEventRecord, error: Error | unknown) => FirehoseTransformationResultRecord
} {
    return {
        onError: (original: FirehoseTransformationEventRecord, error: Error | unknown): FirehoseTransformationResultRecord => {
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
