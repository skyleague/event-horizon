import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SnsRecordSchema } from '../../dev/aws/sns/sns.type.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface SNSEvent<Payload = unknown> {
    payload: Payload
    readonly raw: SnsRecordSchema
}

export interface SNSEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (
        request: NoInfer<SNSEvent<Payload>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<void>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SNSHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sns: SNSEventHandler<Configuration, Service, Profile, Payload>
}
