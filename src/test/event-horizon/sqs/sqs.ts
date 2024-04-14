import type { SQSEvent, SQSHandler, SQSPayload } from '../../../events/sqs/types.js'
import { SQSRecord } from '../../aws/sqs/sqs.type.js'

import type { Dependent } from '@skyleague/axioms'
import { alphaNumeric, array, constant, integer, object, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function sqsEvent<Configuration, Service, Profile, Payload, MessageGrouping extends { by?: 'message-group-id' }>(
    definition: SQSHandler<Configuration, Service, Profile, Payload, MessageGrouping>,
): Dependent<SQSPayload<MessageGrouping, Payload>> {
    const { sqs } = definition
    if (sqs.messageGrouping === undefined) {
        return object({
            messageGroupId: alphaNumeric({ minLength: 1 }),
            payload: sqs.schema.payload !== undefined ? arbitrary(sqs.schema.payload) : unknown(),
            raw: arbitrary(SQSRecord),
            item: integer({ min: 0, max: 10 }),
        } satisfies { [k in keyof SQSEvent]: unknown }) as Dependent<SQSPayload<MessageGrouping, Payload>>
    }
    return tuple(
        array(
            object({
                // this will be overwritten by the map below
                messageGroupId: constant(''),
                item: constant(0),

                payload: sqs.schema.payload !== undefined ? arbitrary(sqs.schema.payload) : unknown(),
                raw: arbitrary(SQSRecord),
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
                }) satisfies { [k in keyof SQSEvent]: unknown },
        ),
        messageGroupId,
    })) as Dependent<SQSPayload<MessageGrouping, Payload>>
}
