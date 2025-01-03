import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { KinesisDataStreamRecord } from '../../../aws/kinesis/kinesis.type.js'
import type { KinesisEvent, KinesisHandler } from '../../../events/kinesis/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

export function kinesisEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser = undefined,
>(
    { kinesis }: KinesisHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<KinesisEvent<InferFromParser<Payload, unknown>>> {
    const record = arbitrary(KinesisDataStreamRecord).constant(generation === 'fast')
    const payload = (kinesis.schema.payload !== undefined ? arbitrary(kinesis.schema.payload) : unknown()) as Dependent<
        InferFromParser<Payload, unknown>
    >
    return tuple(record, payload).map(([r, p]) => {
        const event = {
            raw: r,
            payload: p,
        }
        event.raw.kinesis.data = JSON.stringify(event.payload)

        return event
    })
}
