import type { FirehoseTransformationEvent, FirehoseTransformationHandler } from '../../../events/firehose/types.js'
import { FirehoseTransformationEventRecord } from '../../aws/firehose/firehose.type.js'

import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

/**
 * @experimental
 */
export function firehoseTransformationEvent<Configuration, Service, Profile, Payload, Result>({
    firehose,
}: FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>): Dependent<
    FirehoseTransformationEvent<Payload>
> {
    const record = arbitrary(FirehoseTransformationEventRecord)
    const payload = firehose.schema.payload !== undefined ? arbitrary(firehose.schema.payload) : unknown()
    return tuple(record, payload).map(([r, p]) => ({
        raw: r,
        payload: p,
    })) as unknown as Dependent<FirehoseTransformationEvent<Payload>>
}
