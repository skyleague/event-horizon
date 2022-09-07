import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Schema } from '@skyleague/therefore'
import type { KinesisStreamRecord } from 'aws-lambda'

export interface KinesisEvent<P = unknown> {
    payload: P
    raw: KinesisStreamRecord
}

export interface KinesisEventHandler<C = never, S = never, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (request: P, context: LambdaContext<C, S>) => Promise<R> | R
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface KinesisHandler<C = never, S = never, P = unknown, R = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    kinesis: KinesisEventHandler<C, S, P, R>
}
