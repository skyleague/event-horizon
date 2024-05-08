import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface EventBridgeEvent<Payload = unknown> {
    payload: Payload
    readonly raw: EventBridgeSchema
}

export interface EventBridgeEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    Result = unknown,
> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (
        request: NoInfer<EventBridgeEvent<Payload>>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<Result>>>
}

export interface EventBridgeHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Payload = unknown,
    Result = unknown,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    eventBridge: EventBridgeEventHandler<Configuration, Service, Profile, Payload, Result>
}
