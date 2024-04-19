import type { KinesisEvent, KinesisHandler } from '../../../events/kinesis/types.js'
import { KinesisStreamRecord } from '../../aws/kinesis/kinesis.type.js'

import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function kinesisEvent<Configuration, Service, Profile, Payload>({
    kinesis,
}: KinesisHandler<Configuration, Service, Profile, Payload>): Dependent<KinesisEvent<Payload>> {
    const record = arbitrary(KinesisStreamRecord)
    const payload = kinesis.schema.payload !== undefined ? arbitrary(kinesis.schema.payload) : unknown()
    return tuple(record, payload).map(([r, p]) => ({
        raw: r,
        payload: p,
    })) as unknown as Dependent<KinesisEvent<Payload>>
}
