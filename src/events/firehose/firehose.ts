import type { KinesisFirehoseRecord } from '../../aws/firehose/firehose.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleFirehoseTransformation } from './handler.js'
import type { FirehoseTransformationHandler } from './types.js'

export function firehoseHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, Result, D>(
    definition: D & FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>,
    { _kernel = handleFirehoseTransformation }: { _kernel?: typeof handleFirehoseTransformation } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'records' in request) {
                const records: KinesisFirehoseRecord[] = []
                const other: unknown[] = []
                for (const record of request.records) {
                    if ('recordId' in record) {
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
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
