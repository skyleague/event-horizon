import type { Logger } from '../../observability/logger/logger.js'
import type { GenericParser } from '../../parsers/types.js'
import type { LambdaContext } from '../types.js'

export interface IOLoggerOptions {
    type: string
}

export function ioLoggerChild<C extends LambdaContext<unknown, unknown, GenericParser>>(ctx: C, logger: Logger) {
    return {
        before: (bindings: Record<string, unknown>) => {
            ctx.logger = logger.child(bindings)
        },
        after: () => {
            ctx.logger = logger
        },
    }
}
