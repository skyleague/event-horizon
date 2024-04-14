import type { FirehoseTransformationEvent } from './firehose.type.js'

import type { FirehoseTransformationEvent as LambdaFirehoseTransformationEvent } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    const _test: FirehoseTransformationEvent = {} as unknown as LambdaFirehoseTransformationEvent
    const _test2: LambdaFirehoseTransformationEvent = {} as unknown as FirehoseTransformationEvent
})
