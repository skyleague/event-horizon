import { handleFirehoseTransformation } from './handler.js'
import { type FirehoseTransformationHandler } from './types.js'

import { EventError } from '../../errors/index.js'
import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { FirehoseTransformationEventRecord } from 'aws-lambda'

export function firehoseHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, Result, D>(
    definition: D & FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>,
    { kernel = handleFirehoseTransformation }: { kernel?: typeof handleFirehoseTransformation } = {}
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'records' in request) {
                const records: FirehoseTransformationEventRecord[] = []
                const other = []
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
                return kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
