import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'

import type { FirehoseTransformationEventRecord, FirehoseTransformationResultRecord } from 'aws-lambda'

export function firehoseErrorHandler({ logger, isSensitive }: LambdaContext) {
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
