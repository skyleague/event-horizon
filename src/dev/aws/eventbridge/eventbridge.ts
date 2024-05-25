import { $ref, $string, $unknown } from '@skyleague/therefore'
import type { ThereforeSchema } from '@skyleague/therefore/src/lib/primitives/types.js'
import { EventBridgeSchema } from './eventbridge.type.js'

export function $eventBridge({
    detailType = $string(),
    detail = $unknown(),
}: {
    detailType?: ThereforeSchema
    detail?: ThereforeSchema
} = {}) {
    return $ref(EventBridgeSchema)
        .extend({
            'detail-type': detailType,
            detail: detail,
        })
        .validator()
}
