import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { $ref, $string, $unknown, type Node } from '@skyleague/therefore'
import { EventBridgeSchema } from '../../../aws/eventbridge/eventbridge.type.js'
import type { EventBridgeEvent, EventBridgeHandler } from '../../../events/eventbridge/types.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'

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

export function eventBridgeEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser,
    Result extends MaybeGenericParser,
>(
    { eventBridge }: EventBridgeHandler<Configuration, Service, Profile, Payload, Result>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<EventBridgeEvent<Payload>> {
    const record = arbitrary(EventBridgeSchema).constant(generation === 'fast')
    const payload = eventBridge.schema.payload !== undefined ? arbitrary(eventBridge.schema.payload) : unknown()
    return tuple(record, payload).map(([r, p]) => ({
        raw: r,
        payload: p,
    })) as unknown as Dependent<EventBridgeEvent<Payload>>
}
