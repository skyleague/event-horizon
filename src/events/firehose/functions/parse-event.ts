import type { FirehoseTransformationEvent, FirehoseTransformationEventHandler } from '../types'

import type { FirehoseTransformationEventRecord } from 'aws-lambda'

export function firehoseParseEvent({ payloadType = 'json' }: FirehoseTransformationEventHandler) {
    return {
        before: (event: FirehoseTransformationEventRecord): FirehoseTransformationEvent => {
            let payload: unknown = event.data
            if (payloadType !== 'binary') {
                const unencodedPayload = Buffer.from(event.data, 'base64').toString()
                payload = payloadType === 'json' ? JSON.parse(unencodedPayload) : unencodedPayload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
