import type { HandlerDefinition, Services } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda/trigger/eventbridge'

export interface EventBridgeEvent<D = unknown> {
    detail: D
    source: string
    detailType: string
    raw: AWSEventBridgeEvent<string, D>
}

export interface EventBridgeEventHandler<S extends Services | undefined = undefined, D = unknown, R = unknown> {
    schema: {
        detail?: Schema<D>
        result?: Schema<R>
    }
    handler: (request: EventBridgeEvent<D>, context: LambdaContext<S>) => Promise<R> | R
    detailType?: 'binary' | 'json' | 'plaintext'
}

export interface EventBridgeHandler<S extends Services | undefined = undefined, D = unknown, R = unknown>
    extends HandlerDefinition {
    services?: S
    eventBridge: EventBridgeEventHandler<S, D, R>
}
