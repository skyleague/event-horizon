import type { EventBridgeEvent, EventBridgeEventHandler } from '../../events/eventbridge/types'

import { isString } from '@skyleague/axioms'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export function eventBridgeParseEvent({ detailType = 'json' }: EventBridgeEventHandler) {
    return {
        before: (event: AWSEventBridgeEvent<string, unknown>): EventBridgeEvent => {
            let detail: unknown = event.detail
            if (detailType !== 'binary' && isString(event.detail)) {
                detail = detailType === 'json' ? JSON.parse(event.detail) : event.detail
            }
            return {
                detail: detail,
                source: event.source,
                detailType: event['detail-type'],
                raw: event,
            }
        },
    }
}
