import type { LambdaContext } from '../../events/context'

export interface IOLoggerOptions {
    type: string
}

export function ioLogger({ type }: IOLoggerOptions, { logger, isSensitive }: LambdaContext) {
    return {
        before: (event: unknown, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] start`, { event, ...meta })
            }
        },
        after: (response?: unknown, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] sent `, { response, ...meta })
            }
        },
    }
}
