import type { Logger } from '../../observability/logger/logger.js'
import type { LambdaContext } from '../types.js'

export interface IOLoggerOptions {
    type: string
}

export function ioLoggerChild<C extends LambdaContext>(ctx: C, logger: Logger) {
    return {
        before: (bindings: Record<string, unknown>) => {
            ctx.logger = logger.child(bindings)
        },
        after: () => {
            ctx.logger = logger
        },
    }
}
