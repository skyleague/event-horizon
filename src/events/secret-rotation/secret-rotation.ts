import type { SetRequired } from '@skyleague/axioms/types'
import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleSecretRotationEvent } from './handler.js'
import type { SecretRotationHandler } from './types.js'

export function secretRotationHandler<
    D,
    Configuration = undefined,
    Service extends SetRequired<DefaultServices, 'secretsManager'> = SetRequired<DefaultServices, 'secretsManager'>,
    Profile extends MaybeGenericParser = undefined,
>(
    definition: D & SecretRotationHandler<Configuration, Service, Profile>,
    { _kernel = handleSecretRotationEvent }: { _kernel?: typeof handleSecretRotationEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'SecretId' in request) {
                return _kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile>
}
