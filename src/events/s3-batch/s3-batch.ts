import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleS3Batch } from './handler.js'
import type { S3BatchHandler } from './types.js'

export function s3BatchHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Result extends MaybeGenericParser = undefined,
>(
    definition: D & S3BatchHandler<Configuration, Service, Profile, Result>,
    { _kernel = handleS3Batch }: { _kernel?: typeof handleS3Batch } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'tasks' in request) {
                return _kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
