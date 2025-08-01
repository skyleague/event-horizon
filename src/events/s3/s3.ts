import type { S3RecordSchema } from '../../aws/s3.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleS3Event } from './handler.js'
import type { S3Handler } from './types.js'

export function s3Handler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
>(
    definition: D & S3Handler<Configuration, Service, Profile>,
    { _kernel = handleS3Event }: { _kernel?: typeof handleS3Event } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: S3RecordSchema[] = []
                const other: unknown[] = []
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
                return _kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    })
}
