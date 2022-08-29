import type { HandlerDefinition, Services } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<S extends Services | undefined = undefined, E = unknown, R = unknown> {
    schema: {
        event?: Schema<E>
        result?: Schema<R>
    }
    handler: (request: E, context: LambdaContext<S>) => Promise<R> | R
}

export interface RawHandler<S extends Services | undefined = undefined, E = unknown, R = unknown> extends HandlerDefinition {
    services?: S
    raw: RawEventHandler<E, R>
}
