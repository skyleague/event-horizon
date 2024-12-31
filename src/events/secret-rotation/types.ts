import type { Try } from '@skyleague/axioms'
import type { Promisable, SetRequired } from '@skyleague/axioms/types'
import type { SecretsManagerRotationEvent } from 'aws-lambda'
import type { MaybeGenericParser } from '../../parsers/types.js'
import type { DefaultServices, EventHandlerDefinition, LambdaContext } from '../types.js'

export interface SecretRotationRequest {
    step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    secretId: string
    clientRequestToken: string
    readonly raw: SecretsManagerRotationEvent
}

export interface SecretRotationEventHandler<
    Configuration = unknown,
    Service extends SetRequired<DefaultServices, 'secretsManager'> = SetRequired<DefaultServices, 'secretsManager'>,
    Profile extends MaybeGenericParser = MaybeGenericParser,
> {
    handler: (request: SecretRotationRequest, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
}

export interface SecretRotationHandler<
    Configuration = unknown,
    Service extends SetRequired<DefaultServices, 'secretsManager'> = SetRequired<DefaultServices, 'secretsManager'>,
    Profile extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    secretRotation: SecretRotationEventHandler<Configuration, Service, Profile>
}
