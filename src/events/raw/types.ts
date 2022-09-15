import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<C = never, S = never, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (request: P, context: LambdaContext<C, S>) => Promise<R> | R
}

export interface RawHandler<C = never, S = never, P = unknown, R = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    raw: RawEventHandler<C, S, P, R>
}
