import type { EventBridgeEvent, EventBridgeEventHandler } from '../types'

import { isString } from '@skyleague/axioms'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export function eventBridgeParseEvent({ payloadType = 'json' }: EventBridgeEventHandler) {
    return {
        before: (event: AWSEventBridgeEvent<string, unknown>): EventBridgeEvent => {
            let payload: unknown = event.detail
            if (payloadType !== 'binary' && isString(event.detail)) {
                payload = payloadType === 'json' ? JSON.parse(event.detail) : event.detail
            }
            return {
                payload,
                raw: event,
            }
        },
    }
}
