import type { Try } from '@skyleague/axioms'
import type { Promisable } from '@skyleague/axioms/types'
import type { SnsNotificationSchema } from '../../aws/sns/sns.type.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface SNSEvent<Payload = unknown> {
    payload: Payload
    readonly raw: SnsNotificationSchema
}

export interface SNSEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
    }
    handler: (
        request: NoInfer<SNSEvent<InferFromParser<Payload, unknown>>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<void>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SNSHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    sns: SNSEventHandler<Configuration, Service, Profile, Payload>
}
