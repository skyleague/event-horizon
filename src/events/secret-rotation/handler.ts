import { secretParseEvent } from './functions/parse-event'
import { secretValidateEvent } from './functions/validate-event'
import type { SecretRotationHandler, SecretRotationServices } from './types'

import { ioLogger } from '../functions/io-logger'
import type { LambdaContext } from '../types'

import type { Try } from '@skyleague/axioms'
import { isJust, mapTry } from '@skyleague/axioms'
import type { SecretsManagerRotationEvent } from 'aws-lambda'

export async function handleSecretRotationEvent(
    handler: SecretRotationHandler,
    event: SecretsManagerRotationEvent,
    context: LambdaContext<never, SecretRotationServices>
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
    })

    ioLoggerFn.after()

    return response
}
