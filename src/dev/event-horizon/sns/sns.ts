import type { SNSEvent, SNSHandler } from '../../../events/sns/types.js'

import type { Dependent } from '@skyleague/axioms'
import { object, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { SnsRecordSchema } from '../../../aws/sns/sns.type.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'

export function snsEvent<Configuration, Service, Profile extends MaybeGenericParser, Payload extends MaybeGenericParser>(
    definition: SNSHandler<Configuration, Service, Profile, Payload>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SNSEvent<Payload>> {
    const { sns } = definition
    return object({
        payload: sns.schema.payload !== undefined ? arbitrary(sns.schema.payload) : unknown(),
        raw: arbitrary(SnsRecordSchema).constant(generation === 'fast'),
    }) as unknown as Dependent<SNSEvent<Payload>>
}
