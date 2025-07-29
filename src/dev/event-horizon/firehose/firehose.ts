import { KinesisFirehoseRecordSchema } from '@aws-lambda-powertools/parser/schemas'
import type { Dependent } from '@skyleague/axioms'
import { json, tuple } from '@skyleague/axioms'
import { arbitrary, type Schema } from '@skyleague/therefore'
import type { FirehoseTransformationEvent, FirehoseTransformationHandler } from '../../../events/firehose/types.js'
import type { DefaultServices } from '../../../events/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

/**
 * @experimental
 */
export function firehoseTransformationEvent<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser = undefined,
    Result extends MaybeGenericParser = undefined,
>(
    { firehose }: FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<FirehoseTransformationEvent<InferFromParser<Payload, unknown>>> {
    const record = arbitrary(KinesisFirehoseRecordSchema).constant(generation === 'fast')
    const payload = (
        firehose.schema.payload !== undefined ? arbitrary(firehose.schema.payload as Schema<unknown>) : json()
    ) as Dependent<InferFromParser<Payload, unknown>>
    return tuple(record, payload).map(([r, p]) => {
        const event = {
            raw: r,
            payload: p,
        }
        // The Firehose record's data field should be base64-encoded, as AWS Firehose expects the data in this format.
        event.raw.data = Buffer.from(JSON.stringify(event.payload)).toString('base64')
        return event
    })
}
