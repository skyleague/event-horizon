import { $ref, $string, $unknown, type Node } from '@skyleague/therefore'
import { EventBridgeSchema } from './eventbridge.type.js'

export function $eventBridge({
    detailType = $string(),
    detail = $unknown(),
}: {
    detailType?: Node
    detail?: Node
} = {}) {
    return $ref(EventBridgeSchema).extend({
        'detail-type': detailType,
        detail: detail,
    })
}
