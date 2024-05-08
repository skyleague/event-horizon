import type { UndefinedOnPartialDeep } from '@skyleague/axioms/types'

import type { EventBridgeEvent } from 'aws-lambda'
import { it } from 'vitest'
import type { EventBridgeSchema } from './eventbridge.type.js'

import type { Equal, Expect } from 'type-testing'

it('type is compatible', () => {
    type _test_events = Expect<Equal<EventBridgeSchema, EventBridgeEvent<string, unknown>>>

    const _test: EventBridgeSchema = {} as unknown as EventBridgeEvent<string, unknown>
    const _test2: UndefinedOnPartialDeep<EventBridgeEvent<string, unknown>> = {} as unknown as EventBridgeSchema
})
