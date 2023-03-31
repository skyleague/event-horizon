import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { SecretsManager } from '@aws-sdk/client-secrets-manager'
import type { Promisable, Try } from '@skyleague/axioms'
import type { SecretsManagerRotationEvent } from 'aws-lambda'

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
    handler: (request: SecretRotationRequest, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
}

export interface SecretRotationServices {
    secretsManager: SecretsManager
}

export interface SecretRotationHandler<
    Configuration = never,
    Service extends SecretRotationServices = SecretRotationServices,
    Profile = never
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    secretRotation: SecretRotationEventHandler<Configuration, Service, Profile>
}
