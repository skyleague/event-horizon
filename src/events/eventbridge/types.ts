import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

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
    handler: (request: EventBridgeEvent<P>, context: LambdaContext<C, S>) => Promise<R> | R
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface EventBridgeHandler<C = never, S = never, P = unknown, R = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    eventBridge: EventBridgeEventHandler<C, S, P, R>
}
