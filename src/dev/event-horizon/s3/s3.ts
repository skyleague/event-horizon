import { S3Schema } from '@aws-lambda-powertools/parser/schemas'
import type { Dependent } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { S3Event, S3Handler } from '../../../events/s3/types.js'

export function s3Event(_?: S3Handler, { generation = 'fast' }: { generation?: 'full' | 'fast' } = {}): Dependent<S3Event> {
    const record = arbitrary(S3Schema.shape.Records.element).constant(generation === 'fast')
    return record.map((r) => ({
        raw: r,
    }))
}
