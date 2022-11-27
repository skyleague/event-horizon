import type { Config, LambdaContext, Services, EventHandlerDefinition } from '../types'

import type { Promisable } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { SNSEventRecord } from 'aws-lambda'

export interface SNSEvent<E = unknown> {
    payload: E
    raw: SNSEventRecord
}

export interface SNSEventHandler<C = never, S = never, E = unknown> {
    schema: {
        payload?: Schema<E>
    }
    handler: (request: SNSEvent<E>, context: LambdaContext<C, S>) => Promisable<void>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SNSHandler<C = never, S = never, E = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    sns: SNSEventHandler<C, S, E>
}
