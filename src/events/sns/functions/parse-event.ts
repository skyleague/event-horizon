import { parseJSON } from '../../../parsers/index.js'
import type { SNSEvent, SNSEventHandler } from '../types.js'

import type { SNSEventRecord } from 'aws-lambda'

export function snsParseEvent({ payloadType = 'json' }: Pick<SNSEventHandler, 'payloadType'>) {
    return {
        before: (event: SNSEventRecord): SNSEvent => {
            let payload: unknown = event.Sns.Message
            if (payloadType !== 'binary') {
                payload = payloadType === 'json' ? parseJSON(event.Sns.Message) : event.Sns.Message
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
