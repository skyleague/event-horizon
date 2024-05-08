import { handleRawEvent } from './handler.js'
import type { RawHandler } from './types.js'

import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'

export function rawHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, Result, D>(
    definition: D & RawHandler<Configuration, Service, Profile, Payload, Result>,
    { _kernel = handleRawEvent }: { _kernel?: typeof handleRawEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            return _kernel(definition, request, context)
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
