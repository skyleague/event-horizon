import type { DefaultServices, EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SQSBatchItemFailure } from 'aws-lambda'
import type { SqsRecordSchema } from '../../dev/aws/sqs/sqs.type.js'
import type { EventHandlerFn } from '../common/event.js'

export interface SQSEvent<Payload = unknown> {
    messageGroupId: string
    payload: Payload
    item: number
    readonly raw: SqsRecordSchema
}

export interface SQSEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (
        payload: SQSEvent<Payload>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<void>>>
    payloadType?: 'json' | 'plaintext'
}

export interface SQSHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSEventHandler<Configuration, Service, Profile, Payload>
}

export interface SQSEnvelopeHandler<
    Configuration = unknown,
    Service extends DefaultServices | undefined = DefaultServices,
    Profile = unknown,
> {
    envelope: EventHandlerFn<Configuration, Service, Profile>
}

export interface SQSMessageGroup<Payload = unknown> {
    messageGroupId: string
    records: SQSEvent<Try<Payload>>[]
}

export interface SQSGroupEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown> {
    schema: {
        payload?: Schema<Payload>
    }
    handler: (
        payload: SQSMessageGroup<Payload>,
        context: LambdaContext<Configuration, Service, Profile>,
        // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
    ) => Promisable<Try<NoInfer<SQSBatchItemFailure[] | void>>>
    payloadType?: 'json' | 'plaintext'

    /**
     * The number of message groups to process in parallel.
     *
     * @default 1
     */
    parallelism?: number
}

export interface SQSGroupHandler<Configuration = unknown, Service = unknown, Profile = unknown, Payload = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSGroupEventHandler<Configuration, Service, Profile, Payload>
}
