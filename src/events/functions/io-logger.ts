import { constants } from '../../constants'
import type { LambdaContext } from '../types'

export interface IOLoggerOptions {
    type: string
}

export function ioLogger<C extends LambdaContext<unknown, unknown>>({ type }: IOLoggerOptions, { logger, isSensitive }: C) {
    return {
        before: (event: unknown, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] start`, constants.logEventPayload ? { event, ...meta } : {})
            }
        },
        after: (response?: unknown, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] sent`, constants.logResultPayload ? { response, ...meta } : {})
            }
        },
    }
}
