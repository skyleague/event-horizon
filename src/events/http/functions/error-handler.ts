import { constants } from '../../../constants.js'
import { EventError } from '../../../errors/event-error/index.js'
import type { LambdaContext } from '../../types.js'
import type { HTTPResponse } from '../types.js'

export function httpErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (error: Error | unknown): HTTPResponse => {
            const eventError = EventError.from(error)

            if (!isSensitive) {
                if (eventError.statusCode >= 500) {
                    logger.error(`Error found`, eventError)
                } else if (eventError.statusCode >= 400) {
                    logger.info('Client error found', eventError)
                } else {
                    logger.error(`Error found`, eventError)
                }
            }

            return {
                statusCode: eventError.statusCode,
                body: {
                    statusCode: eventError.statusCode,
                    message: eventError.expose && !isSensitive ? eventError.message : eventError.name,
                    stack:
                        constants.isDebug && eventError.expose && eventError.isServerError && !isSensitive
                            ? eventError.stack
                            : undefined,
                },
            }
        },
    }
}
