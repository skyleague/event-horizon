import type { S3Event } from '../../events/s3/types'

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
