import type { KinesisStreamEvent } from './kinesis.type.js'

import type { KinesisStreamEvent as LambdaKinesisStreamEvent } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    const _test: KinesisStreamEvent = {} as unknown as LambdaKinesisStreamEvent
    const _test2: LambdaKinesisStreamEvent = {} as unknown as KinesisStreamEvent
})
