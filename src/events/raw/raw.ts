import type { MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerFn } from '../common/event.js'
import { eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleRawEvent } from './handler.js'
import type { RawHandler } from './types.js'

export function rawHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Payload extends MaybeGenericParser = undefined,
    Result extends MaybeGenericParser = undefined,
>(
    definition: D & RawHandler<Configuration, Service, Profile, Payload, Result>,
    { _kernel = handleRawEvent }: { _kernel?: typeof handleRawEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile, Result> {
    return eventHandler(definition, {
        handler: (request, context) => {
            return _kernel(definition, request, context)
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Result>
}
