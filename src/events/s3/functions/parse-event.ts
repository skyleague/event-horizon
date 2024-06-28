import type { S3RecordSchema } from '../../../aws/s3/s3.type.js'
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
