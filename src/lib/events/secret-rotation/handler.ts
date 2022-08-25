import type { SecretRotationEventHandler } from './types'

import { secretParseEvent } from '../../functions/secret-rotation/secret-parse-event'
import { secretValidateEvent } from '../../functions/secret-rotation/secret-validate-event'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import type { SecretsManagerRotationEvent } from 'aws-lambda'

export async function handleSecretRotationEvent(
    secrets: SecretRotationEventHandler | undefined,
    event: SecretsManagerRotationEvent,
    context: LambdaContext
): Promise<void> {
    if (secrets === undefined) {
        throw EventError.notImplemented()
    }
    const parseEventFn = secretParseEvent()
    const validateEventFn = secretValidateEvent(secrets, context)

    const secretRotationEvent = parseEventFn.before(event)
    await validateEventFn.before(secretRotationEvent)

    return secrets.handler(secretRotationEvent, context)
}
