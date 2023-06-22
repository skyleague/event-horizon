import type { EventHandlerDefinition, LambdaContext } from '../../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SQSRecord } from 'aws-lambda'

export interface PipesSQSEvent<Payload = unknown> {
    payload: Payload
    raw: SQSRecord
}

export interface PipesSQSEventHandler<
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
    handler: (payload: PipesSQSEvent<Payload>, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<Result>>
    payloadType?: 'json' | 'plaintext'
}

export interface PipesSQSHandler<Configuration = never, Service = never, Profile = never, Payload = unknown, Result = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: PipesSQSEventHandler<Configuration, Service, Profile, Payload, Result>
}
