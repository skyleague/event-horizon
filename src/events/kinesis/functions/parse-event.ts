import { parseJSON } from '../../../parsers/index.js'
import type { KinesisEvent, KinesisEventHandler } from '../types.js'

import type { KinesisStreamRecord } from 'aws-lambda'

export function kinesisParseEvent({ payloadType: dataType = 'json' }: Pick<KinesisEventHandler, 'payloadType'>) {
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
