import { parseJSON } from '../../../parsers'
import type { SQSEvent, SQSEventHandler } from '../types'

import type { SQSRecord } from 'aws-lambda'

export function sqsParseEvent({ payloadType = 'json' }: SQSEventHandler) {
    return {
        before: (event: SQSRecord): SQSEvent => {
            let payload: unknown = event.body
            if (payloadType !== 'plaintext') {
                payload = parseJSON(event.body)
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
