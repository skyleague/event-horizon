import type { HandlerDefinition } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export interface EventBridgeEvent<P = unknown> {
    payload: P
    raw: AWSEventBridgeEvent<string, P>
}

export interface EventBridgeEventHandler<C = unknown, S = unknown, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (request: EventBridgeEvent<P>, context: LambdaContext<C, S>) => Promise<R> | R
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface EventBridgeHandler<C = unknown, S = unknown, P = unknown, R = unknown> extends HandlerDefinition {
    config?: C
    services?: S // Services<C, S>
    eventBridge: EventBridgeEventHandler<C, S, P, R>
}
