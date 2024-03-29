import { handleKinesisEvent } from './handler.js'
import type { KinesisHandler } from './types.js'

import { EventError } from '../../errors/index.js'
import { eventHandler, type EventHandlerFn } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { KinesisStreamRecord } from 'aws-lambda'

export function kinesisHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & KinesisHandler<Configuration, Service, Profile, Payload>,
    { kernel = handleKinesisEvent }: { kernel?: typeof handleKinesisEvent } = {}
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: KinesisStreamRecord[] = []
                const other = []
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
                return kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Payload>
}
