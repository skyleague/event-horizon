import type { HandlerDefinition } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type { SNSEventRecord } from 'aws-lambda'

export interface SNSEvent<E = unknown> {
    payload: E
    raw: SNSEventRecord
}

export interface SnsEventHandler<C = unknown, S = unknown, E = unknown> {
    schema: {
        payload?: Schema<E>
    }
    handler: (request: E, context: LambdaContext<C, S>) => Promise<void> | void
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SnsHandler<C = unknown, S = unknown, E = unknown> extends HandlerDefinition {
    config?: C
    services?: S // Services<C, S>
    sns: SnsEventHandler<C, S, E>
}
