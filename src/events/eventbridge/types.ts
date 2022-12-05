import type { EventHandlerDefinition, LambdaContext } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export interface EventBridgeEvent<Payload = unknown> {
    payload: Payload
    raw: AWSEventBridgeEvent<string, Payload>
}

export interface EventBridgeEventHandler<
    Configuration = never,
    Service = never,
    Profile = never,
    Payload = unknown,
    Result = unknown
> {
    schema: {
        payload?: Schema<Payload>
        result?: Schema<Result>
    }
    handler: (
        request: EventBridgeEvent<Payload>,
        context: LambdaContext<Configuration, Service, Profile>
    ) => Promisable<Try<Result>>
}

export interface EventBridgeHandler<Configuration = never, Service = never, Profile = never, Payload = unknown, Result = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    eventBridge: EventBridgeEventHandler<Configuration, Service, Profile, Payload, Result>
}
