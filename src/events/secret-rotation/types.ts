import type { EventHandlerDefinition, LambdaContext } from '../types'

import type { Promisable } from '@skyleague/axioms'
import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type { SecretsManager } from 'aws-sdk'

export interface SecretRotationRequest {
    step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    secretId: string
    clientRequestToken: string
    raw: SecretsManagerRotationEvent
}

export interface SecretRotationEventHandler<
    Configuration = never,
    Service extends SecretRotationServices = SecretRotationServices,
    Profile = never
> {
    handler: (request: SecretRotationRequest, context: LambdaContext<Configuration, Service, Profile>) => Promisable<void>
}

export interface SecretRotationServices {
    secretManager: SecretsManager
}

export interface SecretRotationHandler<
    Configuration = never,
    Service extends SecretRotationServices = SecretRotationServices,
    Profile = never
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    secretRotation: SecretRotationEventHandler<Configuration, Service, Profile>
}
