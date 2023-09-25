import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SQSRecord } from 'aws-lambda'

export interface SQSEvent<Payload = unknown> {
    payload: Payload
    raw: SQSRecord
}

export interface SQSEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (payload: SQSEvent<Payload>, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
    payloadType?: 'json' | 'plaintext'
}

export interface SQSHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSEventHandler<Configuration, Service, Profile, Payload>
}
