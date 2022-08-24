import type { LambdaContext } from '../context'

import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type SecretManager from 'aws-sdk/clients/secretsmanager'

export interface SecretRotationRequest {
    step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    secretId: string
    clientRequestToken: string
    raw: SecretsManagerRotationEvent
}

export interface SecretRotationEventHandler {
    secretManager: SecretManager
    handler: (request: SecretRotationRequest, context: LambdaContext) => Promise<void> | void
}
