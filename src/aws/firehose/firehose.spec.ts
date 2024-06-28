import type { FirehoseTransformationEvent as LambdaFirehoseTransformationEvent } from 'aws-lambda'
import { it } from 'vitest'
import type { KinesisFirehoseSchema } from './firehose.type.js'

it('type is compatible', () => {
    const _test: KinesisFirehoseSchema = {} as unknown as LambdaFirehoseTransformationEvent
    const _test2: LambdaFirehoseTransformationEvent = {} as unknown as KinesisFirehoseSchema
})
