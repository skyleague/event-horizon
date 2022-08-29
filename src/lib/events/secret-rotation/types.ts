import type { HandlerDefinition } from '../../types'
import type { LambdaContext } from '../context'

import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type { SecretsManager } from 'aws-sdk'

export interface SecretRotationRequest {
    step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    secretId: string
    clientRequestToken: string
    raw: SecretsManagerRotationEvent
}

export interface SecretRotationEventHandler<S extends SecretRotationServices = SecretRotationServices> {
    handler: (request: SecretRotationRequest, context: LambdaContext<S>) => Promise<void> | void
}

export interface SecretRotationServices {
    secretManager: SecretsManager
}

export interface SecretRotationHandler<S extends SecretRotationServices = SecretRotationServices> extends HandlerDefinition {
    services: S
    secretRotation: SecretRotationEventHandler<S>
}
