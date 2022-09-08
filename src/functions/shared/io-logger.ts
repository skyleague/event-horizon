import { logEventPayload, logResultPayload } from '../../constants'
import type { LambdaContext } from '../../events/types'

export interface IOLoggerOptions {
    type: string
}

export function ioLogger({ type }: IOLoggerOptions, { logger, isSensitive }: LambdaContext) {
    return {
        before: (event: unknown, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] start`, logEventPayload ? { event, ...meta } : {})
            }
        },
        after: (response?: unknown, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] sent `, logResultPayload ? { response, ...meta } : {})
            }
        },
    }
}
