import { loggingConstants } from '../../constants.js'
import type { GenericParser } from '../../parsers/types.js'
import type { LambdaContext } from '../types.js'

export interface IOLoggerOptions {
    type: string
}

export function ioLogger<C extends LambdaContext<unknown, unknown, GenericParser>>(
    { type }: IOLoggerOptions,
    { logger, isSensitive }: C,
) {
    return {
        before: (event: Awaited<unknown>, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] start`, loggingConstants.logEventPayload ? { event, ...meta } : {})
            }
        },
        after: (response?: Awaited<unknown>, meta?: Record<string, unknown>) => {
            if (!isSensitive) {
                logger.info(`[${type}] sent`, loggingConstants.logResultPayload ? { response, ...meta } : {})
            }
        },
    }
}
