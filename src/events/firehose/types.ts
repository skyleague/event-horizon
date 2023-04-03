import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { FirehoseRecordTransformationStatus, FirehoseTransformationEventRecord } from 'aws-lambda'

export interface FirehoseTransformationResult<Payload = unknown> {
    status: FirehoseRecordTransformationStatus
    payload: Payload
}

export interface FirehoseTransformationEvent<Payload = unknown> {
    payload: Payload
    raw: FirehoseTransformationEventRecord
}

export interface FirehoseTransformationEventHandler<
    Configuration = never,
    Service = never,
    Profile = never,
    Payload = unknown,
    Result = unknown
> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (
        request: FirehoseTransformationEvent<Payload>,
        context: LambdaContext<Configuration, Service, Profile>
    ) => Promisable<Try<FirehoseTransformationResult<Result>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface FirehoseTransformationHandler<
    Configuration = never,
    Service = never,
    Profile = never,
    Payload = unknown,
    Result = unknown
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    firehose: FirehoseTransformationEventHandler<Configuration, Service, Profile, Payload, Result>
}
