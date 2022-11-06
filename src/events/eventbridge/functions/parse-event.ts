import type { EventBridgeEvent } from '../types'

import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export function eventBridgeParseEvent() {
    return {
        before: (event: AWSEventBridgeEvent<string, unknown>): EventBridgeEvent => {
            return {
                payload: event.detail,
                raw: event,
            }
        },
    }
}
