import type { Promisable, Try } from '@skyleague/axioms'
import type { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface EventBridgeEvent<Payload = unknown> {
    payload: Payload
    readonly raw: EventBridgeSchema
}

export interface EventBridgeEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        payload?: Payload
        result?: Result
    }
    handler: (
        request: NoInfer<EventBridgeEvent<InferFromParser<Payload, unknown>>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<InferFromParser<Result, unknown>>>>
}

export interface EventBridgeHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Payload extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    eventBridge: EventBridgeEventHandler<Configuration, Service, Profile, Payload, Result>
}
