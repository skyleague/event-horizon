import { parseJSON } from '../../../parsers'
import type { KinesisEvent, KinesisEventHandler } from '../types'

import type { KinesisStreamRecord } from 'aws-lambda'

export function kinesisParseEvent({ payloadType: dataType = 'json' }: KinesisEventHandler) {
    return {
        before: (event: KinesisStreamRecord): KinesisEvent => {
            let payload: unknown = event.kinesis.data
            if (dataType !== 'binary') {
                const unencodedPayload = Buffer.from(event.kinesis.data, 'base64').toString()
                payload = dataType === 'json' ? parseJSON(unencodedPayload) : unencodedPayload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
