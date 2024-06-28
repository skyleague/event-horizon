import type { SnsRecordSchema } from '../../../aws/sns/sns.type.js'
import { parseJSON } from '../../../parsers/json/json.js'
import type { SNSEvent, SNSEventHandler } from '../types.js'

export function snsParseEvent({ payloadType = 'json' }: Pick<SNSEventHandler, 'payloadType'>) {
    return {
        before: (event: SnsRecordSchema): SNSEvent => {
            let payload: unknown = event.Sns.Message
            if (payloadType !== 'binary') {
                payload = payloadType === 'json' ? parseJSON(event.Sns.Message) : event.Sns.Message
            }
            return {
                payload: payload,
                raw: event.Sns,
            }
        },
    }
}
