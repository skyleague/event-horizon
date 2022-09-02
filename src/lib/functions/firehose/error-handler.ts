import type { LambdaContext } from '../../events/context'
import { EventError } from '../../events/event-error'

import { isError } from '@skyleague/axioms'
import type { FirehoseTransformationEventRecord, FirehoseTransformationResultRecord } from 'aws-lambda'

export function firehoseErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: FirehoseTransformationEventRecord, error: Error | unknown): FirehoseTransformationResultRecord => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            if (!isSensitive) {
                logger.error(`Uncaught error found`, eventError)
            }

            return {
                recordId: original.recordId,
                result: 'ProcessingFailed',
                data: original.data,
            }
        },
    }
}
