import type { LambdaContext, EventHandlerDefinition } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SNSEventRecord } from 'aws-lambda'

export interface SNSEvent<Payload = unknown> {
    payload: Payload
    raw: SNSEventRecord
}

export interface SNSEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (request: SNSEvent<Payload>, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SNSHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sns: SNSEventHandler<Configuration, Service, Profile, Payload>
}
