import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { KinesisStreamRecord } from 'aws-lambda'

export interface KinesisEvent<Payload = unknown> {
    payload: Payload
    raw: KinesisStreamRecord
}

export interface KinesisEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    Return = unknown,
> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (
        request: NoInfer<KinesisEvent<Payload>>,
        context: LambdaContext<Configuration, Service, Profile>,
        // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
    ) => Promisable<Try<NoInfer<Return | void>>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface KinesisHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    Return = unknown,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    kinesis: KinesisEventHandler<Configuration, Service, Profile, Payload, Return>
}
