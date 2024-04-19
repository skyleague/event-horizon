import type { S3Event } from '../../aws/s3/s3.type.js'
import { S3EventRecord } from '../../aws/s3/s3.type.js'

import type { Dependent } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function s3Event(): Dependent<S3Event> {
    const record = arbitrary(S3EventRecord)
    return record.map((r) => ({
        raw: r,
    })) as unknown as Dependent<S3Event>
}
