import type { KinesisStreamEvent } from 'aws-lambda'
import type { Equal, Expect } from 'type-testing'
import { it } from 'vitest'
import type { KinesisDataStreamSchema } from './kinesis.type.js'

it('type is compatible', () => {
    // @ts-expect-error - KinesisStreamEvent is not compatible with KinesisDataStreamSchema
    type _test_events = Expect<Equal<KinesisDataStreamSchema, KinesisStreamEvent>>

    // @ts-expect-error - KinesisDataStreamSchema is not compatible with KinesisStreamEvent
    const _test: KinesisDataStreamSchema = {} as unknown as KinesisStreamEvent
    // @ts-expect-error - KinesisStreamEvent is not compatible with KinesisDataStreamSchema
    const _test2: KinesisStreamEvent = {} as unknown as KinesisDataStreamSchema
    void _test
    void _test2
})
