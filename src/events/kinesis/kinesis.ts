import type { KinesisDataStreamRecord } from '../../aws/kinesis/kinesis.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleKinesisEvent } from './handler.js'
import type { KinesisHandler } from './types.js'

export function kinesisHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & KinesisHandler<Configuration, Service, Profile, Payload>,
    { _kernel = handleKinesisEvent }: { _kernel?: typeof handleKinesisEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: KinesisDataStreamRecord[] = []
                const other: unknown[] = []
                for (const record of request.Records) {
                    if ('kinesis' in record) {
                        records.push(record)
                    } else {
                        other.push(record)
                    }
                }
                if (other.length > 0) {
                    throw EventError.unexpectedEventType()
                }
                return _kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Payload>
}
