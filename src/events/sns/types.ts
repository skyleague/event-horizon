import type { Config, LambdaContext, Services, EventHandlerDefinition } from '../types'

import type { Schema } from '@skyleague/therefore'
import type { SNSEventRecord } from 'aws-lambda'

export interface SNSEvent<E = unknown> {
    payload: E
    raw: SNSEventRecord
}

export interface SnsEventHandler<C = never, S = never, E = unknown> {
    schema: {
        payload?: Schema<E>
    }
    handler: (request: SNSEvent<E>, context: LambdaContext<C, S>) => Promise<void> | void
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SnsHandler<C = never, S = never, E = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    sns: SnsEventHandler<C, S, E>
}
