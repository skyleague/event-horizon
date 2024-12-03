import type { Promisable, Try } from '@skyleague/axioms'
import type { FirehoseRecordTransformationStatus } from 'aws-lambda'
import type { KinesisFirehoseRecord } from '../../aws/firehose/firehose.type.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface FirehoseTransformationResult<Payload = unknown> {
    status: FirehoseRecordTransformationStatus
    payload: Payload
}

export interface FirehoseTransformationEvent<Payload = unknown> {
    payload: Payload
    readonly raw: KinesisFirehoseRecord
}

export interface FirehoseTransformationEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
        result?: Result
    }
    handler: (
        request: NoInfer<FirehoseTransformationEvent<InferFromParser<Payload, unknown>>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<FirehoseTransformationResult<InferFromParser<Result, unknown>>>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface FirehoseTransformationHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    firehose: FirehoseTransformationEventHandler<Configuration, Service, Profile, Payload, Result>
}
