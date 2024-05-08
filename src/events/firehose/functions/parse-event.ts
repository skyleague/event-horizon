import type { KinesisFirehoseRecord } from '../../../dev/aws/firehose/firehose.type.js'
import { parseJSON } from '../../../parsers/json/json.js'
import type { FirehoseTransformationEvent, FirehoseTransformationEventHandler } from '../types.js'

export function firehoseParseEvent<H extends Pick<FirehoseTransformationEventHandler, 'payloadType'>>({
    payloadType = 'json',
}: H): {
    before: (event: KinesisFirehoseRecord) => FirehoseTransformationEvent
} {
    return {
        before: (event: KinesisFirehoseRecord): FirehoseTransformationEvent => {
            let payload: unknown = event.data
            if (payloadType !== 'binary') {
                const unencodedPayload = Buffer.from(event.data, 'base64').toString()
                payload = payloadType === 'json' ? parseJSON(unencodedPayload) : unencodedPayload
            }
            return {
                payload: payload,
                raw: event,
            }
        },
    }
}
