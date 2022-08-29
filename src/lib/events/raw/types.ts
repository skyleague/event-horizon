import type { HandlerDefinition } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<C = unknown, S = unknown, E = unknown, R = unknown> {
    schema: {
        event?: Schema<E>
        result?: Schema<R>
    }
    handler: (request: E, context: LambdaContext<C, S>) => Promise<R> | R
}

export interface RawHandler<C = unknown, S = unknown, E = unknown, R = unknown> extends HandlerDefinition {
    config?: C
    services?: S // Services<C, S>
    raw: RawEventHandler<C, E, R>
}
