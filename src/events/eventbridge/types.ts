import type { Config, EventHandlerDefinition, LambdaContext, ResponseType, Services } from '../types'

import type { Promisable } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export interface EventBridgeEvent<P = unknown> {
    payload: P
    raw: AWSEventBridgeEvent<string, P>
}

export interface EventBridgeEventHandler<C = never, S = never, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (request: EventBridgeEvent<P>, context: LambdaContext<C, S>) => Promisable<ResponseType<R>>
}

export interface EventBridgeHandler<C = never, S = never, P = unknown, R = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    eventBridge: EventBridgeEventHandler<C, S, P, R>
}
