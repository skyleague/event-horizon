import type { SecretRotationHandler, SecretRotationServices } from './types'

import { secretParseEvent } from '../../functions/secret-rotation/parse-event'
import { secretValidateEvent } from '../../functions/secret-rotation/validate-event'
import type { LambdaContext } from '../types'

import type { SecretsManagerRotationEvent } from 'aws-lambda'

export async function handleSecretRotationEvent(
    handler: SecretRotationHandler,
    event: SecretsManagerRotationEvent,
    context: LambdaContext<never, SecretRotationServices>
): Promise<void> {
    const { secretRotation } = handler
    const parseEventFn = secretParseEvent()
    const validateEventFn = secretValidateEvent(context)

    const secretRotationEvent = parseEventFn.before(event)
    await validateEventFn.before(secretRotationEvent)

    return secretRotation.handler(secretRotationEvent, context)
}