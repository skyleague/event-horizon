import type { Dependent } from '@skyleague/axioms'
import { object, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { ZodType } from 'zod'
import { SnsNotificationSchema } from '../../../aws/sns/sns.type.js'
import type { SNSEvent, SNSHandler } from '../../../events/sns/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'

export function snsEvent<Configuration, Service, Profile extends MaybeGenericParser, Payload extends MaybeGenericParser>(
    definition: SNSHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SNSEvent<InferFromParser<Payload, unknown>>> {
    const { sns } = definition
    return object({
        payload: sns.schema.payload !== undefined ? arbitrary(sns.schema.payload as ZodType) : unknown(),
        raw: arbitrary(SnsNotificationSchema).constant(generation === 'fast'),
    }).map((event) => ({
        ...event,
        raw: {
            ...event.raw,
            Message: JSON.stringify(event.payload),
        },
    }))
}
