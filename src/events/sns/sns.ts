import { handleSNSEvent } from './handler.js'
import type { SNSHandler } from './types.js'

import { EventError } from '../../errors/index.js'
import { eventHandler, type EventHandlerFn } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { SNSEventRecord } from 'aws-lambda'

export function snsHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & SNSHandler<Configuration, Service, Profile>,
    { kernel = handleSNSEvent }: { kernel?: typeof handleSNSEvent } = {}
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: SNSEventRecord[] = []
                const other = []
                for (const record of request.Records) {
                    if ('Sns' in record) {
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
