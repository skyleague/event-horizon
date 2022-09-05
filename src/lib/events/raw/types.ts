import type { Config, HandlerDefinition, Services } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<C = never, S = never, P = unknown, R = unknown> {
    schema: {
        payload?: Schema<P>
        result?: Schema<R>
    }
    handler: (request: P, context: LambdaContext<C, S>) => Promise<R> | R
}

export interface RawHandler<C = never, S = never, P = unknown, R = unknown> extends HandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    raw: RawEventHandler<C, P, R>
}
