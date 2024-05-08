import { $string, $unknown } from '@skyleague/therefore'
import type { ThereforeSchema } from '@skyleague/therefore/src/lib/primitives/types.js'
import { eventBridgeSchema } from './eventbridge.schema.js'

export function $eventBridge({
    detailType = $string(),
    detail = $unknown(),
}: {
    detailType?: ThereforeSchema
    detail?: ThereforeSchema
} = {}) {
    return eventBridgeSchema
        .extend({
            'detail-type': detailType,
            detail: detail,
        })
        .validator()
}
