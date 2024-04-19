import { parseJSON } from '../../../parsers/json/json.js'
import type { SQSEvent, SQSEventHandler } from '../types.js'

import type { SQSRecord } from 'aws-lambda'

export function sqsParseEvent({ payloadType = 'json' }: Pick<SQSEventHandler, 'payloadType'>) {
    return {
        before: (event: SQSRecord, item: number): SQSEvent => {
            let payload: unknown = event.body
            if (payloadType !== 'plaintext') {
                payload = parseJSON(event.body)
            }
            return {
                messageGroupId: event.attributes.MessageGroupId ?? 'unknown',
                payload: payload,
                raw: event,
                item,
            }
        },
    }
}
