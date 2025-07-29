import type { S3BatchEvent as LambdaS3BatchEvent } from 'aws-lambda'
import { it } from 'vitest'
import type { S3BatchEvent } from './s3.type.js'

it('type is compatible', () => {
    const _test: S3BatchEvent = {} as unknown as LambdaS3BatchEvent
    const _test2: LambdaS3BatchEvent = {} as unknown as S3BatchEvent
})
