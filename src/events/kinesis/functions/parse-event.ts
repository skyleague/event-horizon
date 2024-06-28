import type { KinesisDataStreamRecord } from '../../../aws/kinesis/kinesis.type.js'
import { parseJSON } from '../../../parsers/json/json.js'
import type { KinesisEvent, KinesisEventHandler } from '../types.js'

export function kinesisParseEvent({ payloadType: dataType = 'json' }: Pick<KinesisEventHandler, 'payloadType'>) {
    return {
        before: (event: KinesisDataStreamRecord): KinesisEvent => {
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
