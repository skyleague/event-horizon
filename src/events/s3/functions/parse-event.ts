import type { S3Event } from '../types.js'

import type { S3EventRecord } from 'aws-lambda'

export function s3ParseEvent() {
    return {
        before: (event: S3EventRecord): S3Event => {
            return {
                raw: event,
            }
        },
    }
}
