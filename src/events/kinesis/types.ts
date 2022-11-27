import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { KinesisStreamRecord } from 'aws-lambda'

export interface KinesisEvent<P = unknown> {
    payload: P
    raw: KinesisStreamRecord
}

export interface KinesisEventHandler<C = never, S = never, P = unknown> {
    schema: {
        payload?: Schema<P>
    }
    handler: (request: KinesisEvent<P>, context: LambdaContext<C, S>) => Promisable<Try<{} | void>>
    payloadType?: 'binary' | 'json' | 'plaintext'
}

export interface KinesisHandler<C = never, S = never, P = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    kinesis: KinesisEventHandler<C, S, P>
}
