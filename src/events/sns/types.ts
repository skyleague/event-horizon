import type { LambdaContext, EventHandlerDefinition } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SNSEventRecord } from 'aws-lambda'

export interface SNSEvent<Payload = unknown> {
    payload: Payload
    raw: SNSEventRecord
}

export interface SNSEventHandler<Configuration = never, Service = never, Profile = never, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (request: SNSEvent<Payload>, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SNSHandler<Configuration = never, Service = never, Profile = never, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sns: SNSEventHandler<Configuration, Service, Profile, Payload>
}
