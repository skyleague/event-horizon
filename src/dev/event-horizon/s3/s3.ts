import type { Dependent } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { S3Handler } from '../../../events/s3/types.js'
import type { S3Schema } from '../../aws/s3/s3.type.js'
import { S3RecordSchema } from '../../aws/s3/s3.type.js'

export function s3Event(_?: S3Handler, { generation = 'fast' }: { generation?: 'full' | 'fast' } = {}): Dependent<S3Schema> {
    const record = arbitrary(S3RecordSchema).constant(generation === 'fast')
    return record.map((r) => ({
        raw: r,
    })) as unknown as Dependent<S3Schema>
}
