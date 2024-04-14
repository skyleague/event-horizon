import type { EventBridgeEvent } from './eventbridge.type.js'

import type { EventBridgeEvent as LambdaEventBridgeEvent } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    const _test: EventBridgeEvent = {} as unknown as LambdaEventBridgeEvent<string, unknown>
    const _test2: LambdaEventBridgeEvent<string, unknown> = {} as unknown as EventBridgeEvent
})
