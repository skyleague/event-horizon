import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'

export interface RawEventHandler<E = unknown, R = unknown> {
    schema: {
        event?: Schema<E>
        result?: Schema<R>
    }
    handler: (request: E, context: LambdaContext) => Promise<R> | R
}
