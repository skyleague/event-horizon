import type { SecretRotationRequest } from '../types'

import type { SecretsManagerRotationEvent } from 'aws-lambda'

export function secretParseEvent() {
    return {
        before: (event: SecretsManagerRotationEvent): SecretRotationRequest => {
            return {
                step: event.Step,
                secretId: event.SecretId,
                clientRequestToken: event.ClientRequestToken,
                raw: event,
            }
        },
    }
}
