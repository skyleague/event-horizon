import { parseJSON } from '../../../parsers/index.js'
import type { SQSEvent, SQSEventHandler } from '../types.js'

import type { SQSRecord } from 'aws-lambda'

export function sqsParseEvent({ payloadType = 'json' }: Pick<SQSEventHandler, 'payloadType'>) {
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
