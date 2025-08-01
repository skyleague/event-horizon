import { SnsNotificationSchema } from '@aws-lambda-powertools/parser/schemas'
import type { Dependent } from '@skyleague/axioms'
import { object, unknown } from '@skyleague/axioms'
import { arbitrary, type Schema } from '@skyleague/therefore'
import type { SNSEvent, SNSHandler } from '../../../events/sns/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

export function snsEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser = undefined,
>(
    definition: SNSHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SNSEvent<InferFromParser<Payload, unknown>>> {
    const { sns } = definition
    return object({
        payload: (sns.schema.payload !== undefined ? arbitrary(sns.schema.payload as Schema<unknown>) : unknown()) as Dependent<
            InferFromParser<Payload, unknown>
        >,
        raw: arbitrary(SnsNotificationSchema).constant(generation === 'fast'),
    }).map((event) => ({
        ...event,
        raw: {
            ...event.raw,
            Message: JSON.stringify(event.payload),
        },
    }))
}
