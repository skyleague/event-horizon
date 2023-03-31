import type { FirehoseTransformationResult } from '../types.js'

import { isString } from '@skyleague/axioms'
import type { FirehoseTransformationEventRecord, FirehoseTransformationResultRecord } from 'aws-lambda'

export function firehoseSerializeTransformation() {
    return {
        onAfter: (
            original: FirehoseTransformationEventRecord,
            response: FirehoseTransformationResult
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
