import type { Config, HandlerDefinition, Services } from '../../types'
import type { LambdaContext } from '../context'

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
    extends HandlerDefinition {
    config: Config<C>
    services: Services<C, S>
    secretRotation: SecretRotationEventHandler<C, S>
}
