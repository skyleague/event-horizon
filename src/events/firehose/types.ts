import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { FirehoseRecordTransformationStatus } from 'aws-lambda'
import type { KinesisFirehoseRecord } from '../../aws/firehose/firehose.type.js'
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
    Profile = unknown,
    Payload = unknown,
    Result = unknown,
> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (
        request: NoInfer<FirehoseTransformationEvent<Payload>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<FirehoseTransformationResult<Result>>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface FirehoseTransformationHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    Result = unknown,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    firehose: FirehoseTransformationEventHandler<Configuration, Service, Profile, Payload, Result>
}
