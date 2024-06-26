import type { DefaultServices, EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, RequireKeys, Try } from '@skyleague/axioms'
import type { SecretsManagerRotationEvent } from 'aws-lambda'

export interface SecretRotationRequest {
    step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    secretId: string
    clientRequestToken: string
    readonly raw: SecretsManagerRotationEvent
}

export interface SecretRotationEventHandler<
    Configuration = unknown,
    Service extends RequireKeys<DefaultServices, 'secretsManager'> = RequireKeys<DefaultServices, 'secretsManager'>,
    Profile = unknown,
> {
    handler: (
        request: NoInfer<SecretRotationRequest>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<void>>>
}

export interface SecretRotationHandler<
    Configuration = unknown,
    Service extends RequireKeys<DefaultServices, 'secretsManager'> = RequireKeys<DefaultServices, 'secretsManager'>,
    Profile = unknown,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    secretRotation: SecretRotationEventHandler<Configuration, Service, Profile>
}
