import type { SNSEvent } from './sns.type.js'

import type { SNSEvent as LambdaSnsEvent } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    const _test: SNSEvent = {} as unknown as LambdaSnsEvent
    // const _test2: LambdaSnsEvent = {} as unknown as SNSEvent
})
