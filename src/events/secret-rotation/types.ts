import type { EventHandlerDefinition, LambdaContext, Services, Config } from '../types'

import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type { SecretsManager } from 'aws-sdk'

export interface SecretRotationRequest {
    step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    secretId: string
    clientRequestToken: string
    raw: SecretsManagerRotationEvent
}

export interface SecretRotationEventHandler<C = never, S extends SecretRotationServices = SecretRotationServices> {
    handler: (request: SecretRotationRequest, context: LambdaContext<C, S>) => Promise<void> | void
}

export interface SecretRotationServices {
    secretManager: SecretsManager
}

export interface SecretRotationHandler<C = never, S extends SecretRotationServices = SecretRotationServices>
    extends EventHandlerDefinition {
    config: Config<C>
    services: Services<C, S>
    secretRotation: SecretRotationEventHandler<C, S>
}
