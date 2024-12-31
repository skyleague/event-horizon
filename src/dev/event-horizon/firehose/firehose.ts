import type { FirehoseTransformationEvent, FirehoseTransformationHandler } from '../../../events/firehose/types.js'

import type { Dependent } from '@skyleague/axioms'
import { tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { ZodType } from 'zod'
import { KinesisFirehoseRecord } from '../../../aws/firehose/firehose.type.js'
import type { DefaultServices } from '../../../events/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

/**
 * @experimental
 */
export function firehoseTransformationEvent<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser,
    Result extends MaybeGenericParser,
>(
    { firehose }: FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<FirehoseTransformationEvent<InferFromParser<Payload, unknown>>> {
    const record = arbitrary(KinesisFirehoseRecord).constant(generation === 'fast')
    const payload = firehose.schema.payload !== undefined ? arbitrary(firehose.schema.payload as ZodType) : unknown()
    return tuple(record, payload).map(([r, p]) => {
        const event = {
            raw: r,
            payload: p,
        }
        event.raw.data = JSON.stringify(event.payload)
        return event
    })
}
