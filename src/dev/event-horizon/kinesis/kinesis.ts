import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { KinesisDataStreamRecord } from '../../../aws/kinesis/kinesis.type.js'
import type { KinesisEvent, KinesisHandler } from '../../../events/kinesis/types.js'

export function kinesisEvent<Configuration, Service, Profile, Payload>(
    { kinesis }: KinesisHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<KinesisEvent<Payload>> {
    const record = arbitrary(KinesisDataStreamRecord).constant(generation === 'fast')
    const payload = kinesis.schema.payload !== undefined ? arbitrary(kinesis.schema.payload) : unknown()
    return tuple(record, payload).map(([r, p]) => ({
        raw: r,
        payload: p,
    })) as unknown as Dependent<KinesisEvent<Payload>>
}
