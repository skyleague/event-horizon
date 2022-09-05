import type { Config, HandlerDefinition, Services } from '../../types'
import type { LambdaContext } from '../context'

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
    handler: (request: E, context: LambdaContext<C, S>) => Promise<void> | void
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SnsHandler<C = never, S = never, E = unknown> extends HandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    sns: SnsEventHandler<C, S, E>
}
