import { handleS3Batch } from './handler.js'
import type { S3BatchHandler } from './types.js'

import { EventError } from '../../errors/event-error/event-error.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'

export function s3BatchHandler<Configuration, Service extends DefaultServices | undefined, Profile, Result, D>(
    definition: D & S3BatchHandler<Configuration, Service, Profile, Result>,
    { kernel = handleS3Batch }: { kernel?: typeof handleS3Batch } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'tasks' in request) {
                return kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
