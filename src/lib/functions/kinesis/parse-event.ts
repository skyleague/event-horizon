import type { KinesisEvent, KinesisEventHandler } from '../../events/kinesis/types'

import type { KinesisStreamRecord } from 'aws-lambda'

export function kinesisParseEvent({ payloadType: dataType = 'json' }: KinesisEventHandler) {
    return {
        before: (event: KinesisStreamRecord): KinesisEvent => {
            let payload: unknown = event.kinesis.data
            if (dataType !== 'binary') {
                const unencodedPayload = Buffer.from(event.kinesis.data, 'base64').toString()
                payload = dataType === 'json' ? JSON.parse(unencodedPayload) : unencodedPayload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
