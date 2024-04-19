import type { S3Event } from './s3.type.js'

import type { S3Event as LambdaS3Event } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    const _test: S3Event = {} as unknown as LambdaS3Event
    const _test2: LambdaS3Event = {} as unknown as S3Event
})
