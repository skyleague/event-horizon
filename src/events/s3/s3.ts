import { handleS3Event } from './handler.js'
import type { S3Handler } from './types.js'

import { EventError } from '../../errors/event-error/event-error.js'
import { eventHandler, type EventHandlerFn } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { S3EventRecord } from 'aws-lambda'

export function s3Handler<Configuration, Service extends DefaultServices | undefined, Profile, D>(
    definition: D & S3Handler<Configuration, Service, Profile>,
    { kernel = handleS3Event }: { kernel?: typeof handleS3Event } = {}
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: S3EventRecord[] = []
                const other = []
                for (const record of request.Records) {
                    if ('s3' in record) {
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
    }) as D & EventHandlerFn<Configuration, Service, Profile>
}
