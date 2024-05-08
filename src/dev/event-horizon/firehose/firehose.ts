import type { FirehoseTransformationEvent, FirehoseTransformationHandler } from '../../../events/firehose/types.js'

import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { KinesisFirehoseRecord } from '../../aws/firehose/firehose.type.js'

/**
 * @experimental
 */
export function firehoseTransformationEvent<Configuration, Service, Profile, Payload, Result>(
    { firehose }: FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<FirehoseTransformationEvent<Payload>> {
    const record = arbitrary(KinesisFirehoseRecord).constant(generation === 'fast')
    const payload = firehose.schema.payload !== undefined ? arbitrary(firehose.schema.payload) : unknown()
    return tuple(record, payload).map(([r, p]) => ({
        raw: r,
        payload: p,
    })) as unknown as Dependent<FirehoseTransformationEvent<Payload>>
}
