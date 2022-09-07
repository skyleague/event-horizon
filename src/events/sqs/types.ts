import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Schema } from '@skyleague/therefore'
import type { SQSRecord } from 'aws-lambda'

export interface SQSEvent<P = unknown> {
    payload: P
    raw: SQSRecord
}

export interface SQSEventHandler<C = never, S = never, P = unknown> {
    schema: {
        payload?: Schema<P>
    }
    handler: (payload: P, context: LambdaContext<C, S>) => Promise<void> | void
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface SQSHandler<C = never, S = never, P = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    sqs: SQSEventHandler<C, S, P>
}
