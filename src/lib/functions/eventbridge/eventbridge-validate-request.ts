import type { EventBridgeEvent, EventBridgeEventHandler } from '../../events/eventbridge/types'

import type { Either } from '@skyleague/axioms'
import type { ErrorObject } from 'ajv'

export function eventBridgeValidateRequest<E = unknown>() {
    return {
        before: (
            eventBridge: EventBridgeEventHandler,
            event: EventBridgeEvent<E>
        ): Either<ErrorObject[], EventBridgeEvent<E>> => {
            if (eventBridge.schema.detail?.is(event) === false) {
                return { left: eventBridge.schema.detail?.validate.errors ?? [] }
            }
            return {
                right: {
                    detail: event.detail,
                    source: event.source,
                    detailType: event.detailType,
                    raw: event.raw,
                },
            }
        },
    }
}
