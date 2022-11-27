import type { SNSEvent, SNSEventHandler } from '../types'

import type { SNSEventRecord } from 'aws-lambda'

export function snsParseEvent({ payloadType = 'json' }: SNSEventHandler) {
    return {
        before: (event: SNSEventRecord): SNSEvent => {
            let payload: unknown = event.Sns.Message
            if (payloadType !== 'binary') {
                payload = payloadType === 'json' ? JSON.parse(event.Sns.Message) : event.Sns.Message
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
