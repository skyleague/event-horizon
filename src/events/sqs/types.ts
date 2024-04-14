import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SQSBatchItemFailure, SQSRecord } from 'aws-lambda'

export interface SQSEvent<Payload = unknown> {
    messageGroupId: string
    payload: Payload
    raw: SQSRecord
    item: number
}

export interface SQSMessageGroup<Payload = unknown> {
    messageGroupId: string
    records: SQSEvent<Try<Payload>>[]
}

export interface SQSMessageGrouping {
    by?: 'message-group-id'

    /**
     * The number of message groups to process in parallel.
     *
     * @default 1
     */
    parallelism?: number
}

export type SQSPayload<MessageGrouping, Payload> = MessageGrouping extends { by: 'message-group-id' }
    ? SQSMessageGroup<Payload>
    : SQSEvent<Payload>

// biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
export type SQSResult<MessageGrouping> = MessageGrouping extends { by: 'message-group-id' } ? SQSBatchItemFailure[] | void : void

export interface SQSEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    // biome-ignore lint/complexity/noBannedTypes: this is the real type we want here
    MessageGrouping extends SQSMessageGrouping = {},
> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: NoInfer<
        (
            payload: SQSPayload<MessageGrouping, Payload>,
            context: LambdaContext<Configuration, Service, Profile>,
        ) => Promisable<Try<SQSResult<MessageGrouping>>>
    >
    payloadType?: 'json' | 'plaintext'
    messageGrouping?: MessageGrouping
}

export interface SQSHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    // biome-ignore lint/complexity/noBannedTypes: this is the real type we want here
    MessageGrouping extends SQSMessageGrouping = {},
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSEventHandler<Configuration, Service, Profile, Payload, MessageGrouping>
}
