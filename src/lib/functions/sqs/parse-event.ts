import type { SQSEvent, SQSEventHandler } from '../../events/sqs/types'

import type { SQSRecord } from 'aws-lambda'

export function sqsParseEvent({ payloadType = 'json' }: SQSEventHandler) {
    return {
        before: (event: SQSRecord): SQSEvent => {
            let payload: unknown = event.body
            if (payloadType !== 'binary') {
                const unencodedPayload = Buffer.from(event.body, 'base64').toString()
                payload = payloadType === 'json' ? JSON.parse(unencodedPayload) : unencodedPayload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
