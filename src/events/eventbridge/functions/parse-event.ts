import type { UndefinedOnPartialDeep } from '@skyleague/axioms/types'
import type { EventBridgeEvent } from '../types.js'

import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge.js'

export function eventBridgeParseEvent() {
    return {
        before: (event: UndefinedOnPartialDeep<AWSEventBridgeEvent<string, unknown>>): EventBridgeEvent => {
            return {
                payload: event.detail,
                raw: event,
            }
        },
    }
}
