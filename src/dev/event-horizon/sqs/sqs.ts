import type { Dependent } from '@skyleague/axioms'
import { alphaNumeric, array, constant, integer, object, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { ZodType } from 'zod'
import { SqsRecordSchema } from '../../../aws/sqs/sqs.type.js'
import type { SQSEvent, SQSGroupHandler, SQSHandler, SQSMessageGroup } from '../../../events/sqs/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

export function sqsEvent<Configuration, Service, Profile extends MaybeGenericParser, Payload extends MaybeGenericParser>(
    definition: SQSHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SQSEvent<InferFromParser<Payload>>> {
    const { sqs } = definition
    return object({
        messageGroupId: alphaNumeric({ minLength: 1 }),
        payload: sqs.schema.payload !== undefined ? arbitrary(sqs.schema.payload as ZodType) : unknown(),
        raw: arbitrary(SqsRecordSchema).constant(generation === 'fast'),
        item: integer({ min: 0, max: 10 }),
    }).map(({ messageGroupId, payload, raw, item }) => ({
        messageGroupId,
        payload,
        item,
        raw: {
            ...raw,
            body: JSON.stringify(payload),
            attributes: {
                ...raw.attributes,
                MessageGroupId: messageGroupId,
            },
        },
    }))
}

export function sqsGroupEvent<Configuration, Service, Profile extends MaybeGenericParser, Payload extends MaybeGenericParser>(
    definition: SQSGroupHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SQSMessageGroup<InferFromParser<Payload>>> {
    const { sqs } = definition
    return tuple(
        array(
            object({
                // this will be overwritten by the map below
                messageGroupId: constant(''),
                item: constant(0),

                payload: sqs.schema.payload !== undefined ? arbitrary(sqs.schema.payload as ZodType) : unknown(),
                raw: arbitrary(SqsRecordSchema).constant(generation === 'fast'),
            } satisfies { [k in keyof SQSEvent]: unknown }),
            { minLength: 1, maxLength: 10 },
        ),
        alphaNumeric({ minLength: 1 }),
    ).map(([records, messageGroupId]) => ({
        records: records.map(
            (r, item) =>
                ({
                    ...r,
                    messageGroupId,
                    item,
                    raw: {
                        ...r.raw,
                        body: JSON.stringify(r.payload),
                        attributes: {
                            ...r.raw.attributes,
                            MessageGroupId: messageGroupId,
                        },
                    },
                }) satisfies { [k in keyof SQSEvent]: unknown },
        ),
        messageGroupId,
    }))
}
