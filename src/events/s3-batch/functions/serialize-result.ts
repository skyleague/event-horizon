import { isString } from '@skyleague/axioms'
import type { S3BatchEventTask, S3BatchResultResult } from 'aws-lambda'
import type { S3BatchTaskResult } from '../types.js'

export function s3BatchSerializeResult<Result>() {
    return {
        onAfter: (original: S3BatchEventTask, result: S3BatchTaskResult<Result>): S3BatchResultResult => {
            const payload = isString(result.payload) ? result.payload : JSON.stringify(result.payload)
            return {
                taskId: original.taskId,
                resultCode: result.status,
                resultString: payload,
            }
        },
    }
}
