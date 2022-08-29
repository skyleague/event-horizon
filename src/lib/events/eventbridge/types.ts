import type { HandlerDefinition } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export interface EventBridgeEvent<D = unknown> {
    detail: D
    source: string
    detailType: string
    raw: AWSEventBridgeEvent<string, D>
}

export interface EventBridgeEventHandler<C = unknown, S = unknown, D = unknown, R = unknown> {
    schema: {
        detail?: Schema<D>
        result?: Schema<R>
    }
    handler: (request: EventBridgeEvent<D>, context: LambdaContext<C, S>) => Promise<R> | R
    detailType?: 'binary' | 'json' | 'plaintext'
}

export interface EventBridgeHandler<C = unknown, S = unknown, D = unknown, R = unknown> extends HandlerDefinition {
    config?: C
    services?: S // Services<C, S>
    eventBridge: EventBridgeEventHandler<C, S, D, R>
}
