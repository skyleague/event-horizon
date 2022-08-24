import type { SecretRotationEventHandler } from './types'

import { secretParseEvent } from '../../functions/secret-rotation/secret-parse-event'
import { secretValidateEvent } from '../../functions/secret-rotation/secret-validate-event'
import type { LambdaContext } from '../context'
import { HttpError } from '../http/http-error'

import type { SecretsManagerRotationEvent } from 'aws-lambda'

export async function handleSecretRotationEvent(
    secrets: SecretRotationEventHandler | undefined,
    event: SecretsManagerRotationEvent,
    context: LambdaContext
): Promise<void> {
    if (secrets === undefined) {
        throw HttpError.notImplemented()
    }
    const parseEventFn = secretParseEvent()
    const validateEventFn = secretValidateEvent(secrets, context)

    const secretRotationEvent = parseEventFn.before(event)
    await validateEventFn.before(secretRotationEvent)

    return secrets.handler(secretRotationEvent, context)
}
