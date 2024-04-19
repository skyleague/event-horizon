import type { SNSEvent, SNSHandler } from '../../../events/sns/types.js'
import { SNSEventRecord } from '../../aws/sns/sns.schema.js'

import type { Dependent } from '@skyleague/axioms'
import { object, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function snsEvent<Configuration, Service, Profile, Payload>(
    definition: SNSHandler<Configuration, Service, Profile, Payload>,
): Dependent<SNSEvent<Payload>> {
    const { sns } = definition
    return object({
        payload: sns.schema.payload !== undefined ? arbitrary(sns.schema.payload) : unknown(),
        raw: arbitrary(SNSEventRecord),
    }) as unknown as Dependent<SNSEvent<Payload>>
}
