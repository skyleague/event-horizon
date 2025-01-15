import { EventBridgeSchema as AWSEventBridgeSchema } from '@aws-lambda-powertools/parser/schemas'
import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { $moduleRef, type Schema, arbitrary } from '@skyleague/therefore'
import { $ref, $string, $unknown, type Node } from '@skyleague/therefore'
import type { EventBridgeSchema } from '../../../aws/eventbridge/eventbridge.type.js'
import type { EventBridgeEvent, EventBridgeHandler } from '../../../events/eventbridge/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

export const eventBridgeSchemaSymbol = $moduleRef('@aws-lambda-powertools/parser/schemas', 'EventBridgeSchema')

export function $eventBridge({
    detailType = $string(),
    detail = $unknown(),
}: {
    detailType?: Node
    detail?: Node
} = {}) {
    const schema = $ref(AWSEventBridgeSchema)
    schema._toZod = eventBridgeSchemaSymbol
    return schema.extend({
        'detail-type': detailType,
        detail: detail,
    })
}

export function eventBridgeEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser = undefined,
    Result extends MaybeGenericParser = undefined,
>(
    { eventBridge }: EventBridgeHandler<Configuration, Service, Profile, Payload, Result>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<EventBridgeEvent<InferFromParser<Payload, unknown>>> {
    const record = arbitrary(AWSEventBridgeSchema).constant(generation === 'fast')
    const payload = (
        eventBridge.schema.payload !== undefined ? arbitrary(eventBridge.schema.payload as Schema<unknown>) : unknown()
    ) as Dependent<InferFromParser<Payload, unknown>>
    return tuple(record, payload).map(([r, p]) => {
        const event = {
            raw: r as EventBridgeSchema,
            payload: p,
        }
        event.raw.detail = event.payload

        return event
    })
}
