import type { EventBridgeSchema } from '../../../dev/aws/eventbridge/eventbridge.type.js'
import type { EventBridgeEvent } from '../types.js'

export function eventBridgeParseEvent() {
    return {
        before: (event: EventBridgeSchema): EventBridgeEvent => {
            return {
                payload: event.detail,
                raw: event,
            }
        },
    }
}
