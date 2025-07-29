import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type { SecretRotationRequest } from '../types.js'

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
