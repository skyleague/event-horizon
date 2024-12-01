import type { FirehoseTransformationEvent as LambdaFirehoseTransformationEvent } from 'aws-lambda'
import { it } from 'vitest'
import type { KinesisFirehoseSchema } from './firehose.type.js'

it('type is compatible', () => {
    // @ts-expect-error - KinesisFirehoseSchema is not compatible with LambdaFirehoseTransformationEvent
    const _test: KinesisFirehoseSchema = {} as unknown as LambdaFirehoseTransformationEvent
    // @ts-expect-error - LambdaFirehoseTransformationEvent is not compatible with KinesisFirehoseSchema
    const _test2: LambdaFirehoseTransformationEvent = {} as unknown as KinesisFirehoseSchema
})
