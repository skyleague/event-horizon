import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SQSBatchItemFailure, SQSRecord } from 'aws-lambda'

export interface SQSEvent<Payload = unknown> {
    payload: Payload
    raw: SQSRecord
}

export interface SQSMessageGroup<Payload = unknown> {
    messageGroupId: string
    records: {
        payload: Try<Payload>
        raw: SQSRecord
        item: number
    }[]
}

export interface SQSMessageGrouping {
    by?: 'messageGroupId'

    /**
     * The number of message groups to process in parallel.
     *
     * @default 1
     */
    parallelism?: number
}

export type SQSPayload<MessageGrouping, Payload> = MessageGrouping extends { by: 'messageGroupId' }
    ? SQSMessageGroup<Payload>
    : SQSEvent<Payload>

export type SQSResult<MessageGrouping> = MessageGrouping extends { by: 'messageGroupId' } ? SQSBatchItemFailure[] | void : void

export interface SQSEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    MessageGrouping extends SQSMessageGrouping = {},
> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (
        payload: SQSPayload<MessageGrouping, Payload>,
        context: LambdaContext<Configuration, Service, Profile>
    ) => Promisable<Try<SQSResult<MessageGrouping>>>
    payloadType?: 'json' | 'plaintext'
    messageGrouping?: MessageGrouping
}

export interface SQSHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    MessageGrouping extends SQSMessageGrouping = {},
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSEventHandler<Configuration, Service, Profile, Payload, MessageGrouping>
}
