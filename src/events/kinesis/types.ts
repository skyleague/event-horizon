import type { Try } from '@skyleague/axioms'
import type { Promisable } from '@skyleague/axioms/types'
import type { KinesisDataStreamRecord } from '../../aws/kinesis/kinesis.type.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface KinesisEvent<Payload = unknown> {
    payload: Payload
    readonly raw: KinesisDataStreamRecord
}

export interface KinesisEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Return extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
    }
    handler: (
        request: NoInfer<KinesisEvent<InferFromParser<Payload, unknown>>>,
        context: LambdaContext<Configuration, Service, Profile>,
        // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
    ) => Promisable<Try<NoInfer<InferFromParser<Return> | void>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface KinesisHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Return extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    kinesis: KinesisEventHandler<Configuration, Service, Profile, Payload, Return>
}
