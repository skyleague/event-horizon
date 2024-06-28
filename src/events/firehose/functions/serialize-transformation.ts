import { isString } from '@skyleague/axioms'
import type { FirehoseTransformationResultRecord } from 'aws-lambda'
import type { KinesisFirehoseRecord } from '../../../aws/firehose/firehose.type.js'
import type { FirehoseTransformationResult } from '../types.js'

export function firehoseSerializeTransformation(): {
    onAfter: (original: KinesisFirehoseRecord, response: FirehoseTransformationResult) => FirehoseTransformationResultRecord
} {
    return {
        onAfter: (
            original: KinesisFirehoseRecord,
            response: FirehoseTransformationResult,
        ): FirehoseTransformationResultRecord => {
            const payload = isString(response.payload) ? response.payload : JSON.stringify(response.payload)
            return {
                recordId: original.recordId,
                data: Buffer.from(payload).toString('base64'),
                result: response.status,
            }
        },
    }
}
