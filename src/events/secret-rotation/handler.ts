import { secretParseEvent } from './functions/parse-event.js'
import { secretValidateEvent } from './functions/validate-event.js'
import type { SecretRotationHandler } from './types.js'

import { ioLogger } from '../functions/io-logger.js'
import type { DefaultServices, LambdaContext } from '../types.js'

import type { RequireKeys, Try } from '@skyleague/axioms'
import { Nothing, isJust, mapTry } from '@skyleague/axioms'
import type { SecretsManagerRotationEvent } from 'aws-lambda'

export async function handleSecretRotationEvent<
    const Configuration,
    const Service extends RequireKeys<DefaultServices, 'secretsManager'>,
    const Profile,
>(
    handler: SecretRotationHandler<Configuration, Service, Profile>,
    event: SecretsManagerRotationEvent,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<void>> {
    const { secretRotation } = handler
    const parseEventFn = secretParseEvent()
    const validateEventFn = secretValidateEvent(context)
    const ioLoggerFn = ioLogger({ type: 'secret-rotation' }, context)

    ioLoggerFn.before(event)

    const unvalidatedSecretRotationEvent = parseEventFn.before(event)
    const secretRotationEvent = await mapTry(unvalidatedSecretRotationEvent, (e) => validateEventFn.before(e))

    const response = await mapTry(secretRotationEvent, (request) => {
        if (isJust(request)) {
            return secretRotation.handler(request, context)
        }
        return Nothing
    })

    ioLoggerFn.after()

    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
    return response as void
}
