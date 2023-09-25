import { handleSQSEvent } from './handler.js'
import type { SQSHandler } from './types.js'

import { EventError } from '../../errors/index.js'
import { eventHandler, type EventHandlerFn } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { SQSRecord } from 'aws-lambda'

export function sqsHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & SQSHandler<Configuration, Service, Profile>,
    { kernel = handleSQSEvent }: { kernel?: typeof handleSQSEvent } = {}
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: SQSRecord[] = []
                const other = []
                for (const record of request.Records) {
                    if ('messageAttributes' in record) {
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
