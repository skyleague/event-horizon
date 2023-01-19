import type { Logger } from '../../observability/logger'
import type { LambdaContext } from '../types'

export interface IOLoggerOptions {
    type: string
}

export function ioLoggerChild<C extends LambdaContext<unknown, unknown>>(ctx: C, logger: Logger) {
    return {
        before: (bindings: Record<string, unknown>) => {
            ctx.logger = logger.child(bindings)
        },
        after: () => {
            ctx.logger = logger
        },
    }
}
