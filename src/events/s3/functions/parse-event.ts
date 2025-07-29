import type { S3RecordSchema } from '../../../aws/s3.js'
import type { S3Event } from '../types.js'

export function s3ParseEvent() {
    return {
        before: (event: S3RecordSchema): S3Event => {
            return {
                raw: event,
            }
        },
    }
}
