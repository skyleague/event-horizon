import { handleEventBridgeEvent } from './handler.js'
import type { EventBridgeHandler } from './types.js'

import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'

export function eventBridgeHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Payload extends MaybeGenericParser = undefined,
    Result extends MaybeGenericParser = undefined,
>(
    definition: D & EventBridgeHandler<Configuration, Service, Profile, Payload, Result>,
    { _kernel = handleEventBridgeEvent }: { _kernel?: typeof handleEventBridgeEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'detail' in request) {
                return _kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
