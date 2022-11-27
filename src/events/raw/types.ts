import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<C = never, S = never, P = unknown, R = {}> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (request: P, context: LambdaContext<C, S>) => Promisable<Try<R>>
}

export interface RawHandler<C = never, S = never, P = unknown, R = {}> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    raw: RawEventHandler<C, S, P, R>
}
