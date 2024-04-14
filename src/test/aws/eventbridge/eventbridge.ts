import { $array, $object, $string, $unknown, $validator } from '@skyleague/therefore'
import type { ThereforeSchema } from '@skyleague/therefore/src/lib/primitives/types.js'

export function $eventBridge({
    detailType = $string(),
    detail = $unknown(),
}: {
    detailType?: ThereforeSchema
    detail?: ThereforeSchema
} = {}) {
    return $validator(
        $object({
            id: $string,
            version: $string,
            account: $string,
            time: $string,
            region: $string,
            resources: $array($string()),
            source: $string,
            'detail-type': detailType,
            detail: detail,
            'replay-name': $string().optional(),
        }),
    )
}
