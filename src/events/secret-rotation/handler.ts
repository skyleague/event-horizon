import type { Try } from '@skyleague/axioms'
import { Nothing, isJust, mapTry } from '@skyleague/axioms'
import type { SetRequired } from '@skyleague/axioms/types'
import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { ioLogger } from '../functions/io-logger.js'
import type { DefaultServices, LambdaContext } from '../types.js'
import { secretParseEvent } from './functions/parse-event.js'
import { secretValidateEvent } from './functions/validate-event.js'
import type { SecretRotationHandler } from './types.js'

export async function handleSecretRotationEvent<
    Configuration,
    Service extends SetRequired<DefaultServices, 'secretsManager'>,
    Profile extends MaybeGenericParser,
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
