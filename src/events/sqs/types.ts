import type { DefaultServices, EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import type { Promisable } from '@skyleague/axioms/types'
import type { SQSBatchItemFailure } from 'aws-lambda'
import type { SqsRecordSchema } from '../../aws/sqs/sqs.type.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerFn } from '../common/event.js'

export interface SQSEvent<Payload = unknown> {
    messageGroupId: string
    payload: Payload
    item: number
    readonly raw: SqsRecordSchema
}

export interface SQSEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
    }
    handler: (
        payload: SQSEvent<InferFromParser<Payload, unknown>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<void>>
    payloadType?: 'json' | 'plaintext'
}

export interface SQSHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSEventHandler<Configuration, Service, Profile, Payload>
}

export interface SQSEnvelopeHandler<
    Configuration = unknown,
    Service extends DefaultServices | undefined = DefaultServices,
    Profile extends MaybeGenericParser = MaybeGenericParser,
> {
    envelope: EventHandlerFn<Configuration, Service, Profile>
}

export interface SQSMessageGroup<Payload = unknown> {
    messageGroupId: string
    records: SQSEvent<Try<Payload>>[]
}

export interface SQSGroupEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
    }
    handler: (
        payload: SQSMessageGroup<InferFromParser<Payload, unknown>>,
        context: LambdaContext<Configuration, Service, Profile>,
        // biome-ignore lint/suspicious/noConfusingVoidType: false positive
    ) => Promisable<Try<NoInfer<SQSBatchItemFailure[] | void>>>
    payloadType?: 'json' | 'plaintext'

    /**
     * The number of message groups to process in parallel.
     *
     * @default 1
     */
    parallelism?: number
}

export interface SQSGroupHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    sqs: SQSGroupEventHandler<Configuration, Service, Profile, Payload>
}
