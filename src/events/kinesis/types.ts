import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { KinesisStreamRecord } from 'aws-lambda'

export interface KinesisEvent<Payload = unknown> {
    payload: Payload
    raw: KinesisStreamRecord
}

export interface KinesisEventHandler<Configuration = never, Service = never, Profile = never, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (
        request: KinesisEvent<Payload>,
        context: LambdaContext<Configuration, Service, Profile>
    ) => Promisable<Try<{} | void>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface KinesisHandler<Configuration = never, Service = never, Profile = never, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    kinesis: KinesisEventHandler<Configuration, Service, Profile, Payload>
}
