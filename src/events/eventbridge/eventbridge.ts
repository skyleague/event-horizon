import { handleEventBridgeEvent } from './handler.js'
import type { EventBridgeHandler } from './types.js'

import { EventError } from '../../errors/event-error/event-error.js'
import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'

export function eventBridgeHandler<
    const Configuration,
    const Service extends DefaultServices | undefined,
    const Profile,
    const Payload,
    const Result,
    const D,
>(
    definition: D & EventBridgeHandler<Configuration, Service, Profile, Payload, Result>,
    { kernel = handleEventBridgeEvent }: { kernel?: typeof handleEventBridgeEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'detail' in request) {
                return kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
