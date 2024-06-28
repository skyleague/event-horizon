import type { S3Schema } from './s3.type.js'

import type { S3Event } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    // @ts-expect-error
    const _test: S3Schema = {} as unknown as S3Event
    // @ts-expect-error
    const _test2: S3Event = {} as unknown as S3Schema
})
