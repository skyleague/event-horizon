import type { S3BatchTaskResult } from '../../events/s3-batch/types'

import { isString } from '@skyleague/axioms'
import type { S3BatchEventTask, S3BatchResultResult } from 'aws-lambda'

export function s3BatchSerializeResult() {
    return {
        onAfter: (original: S3BatchEventTask, result: S3BatchTaskResult): S3BatchResultResult => {
            const payload = isString(result.payload) ? result.payload : JSON.stringify(result.payload)
            return {
                taskId: original.taskId,
                resultCode: result.status,
                resultString: payload,
            }
        },
    }
}
