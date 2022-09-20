import type { SQSEvent, SQSEventHandler } from '../../events/sqs/types'

import type { SQSRecord } from 'aws-lambda'

export function sqsParseEvent({ payloadType = 'json' }: SQSEventHandler) {
    return {
        before: (event: SQSRecord): SQSEvent => {
            let payload: unknown = event.body
            if (payloadType !== 'plaintext') {
                payload = payloadType === 'json' ? JSON.parse(event.body) : payload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
