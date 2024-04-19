import { handleSecretRotationEvent } from './handler.js'
import type { SecretRotationHandler } from './types.js'

import { EventError } from '../../errors/event-error/event-error.js'
import { eventHandler, type EventHandlerFn } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { RequireKeys } from '@skyleague/axioms'

export function secretRotationHandler<Configuration, Service extends RequireKeys<DefaultServices, 'secretsManager'>, Profile, D>(
    definition: D & SecretRotationHandler<Configuration, Service, Profile>,
    { kernel = handleSecretRotationEvent }: { kernel?: typeof handleSecretRotationEvent } = {}
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'SecretId' in request) {
                return kernel(definition, request, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile>
}
