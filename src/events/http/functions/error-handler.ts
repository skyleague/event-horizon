import { constants } from '../../../constants'
import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'
import type { HTTPResponse } from '../types'

import { isError } from '@skyleague/axioms'

export function httpErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (error: Error | unknown): HTTPResponse => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            if (!isSensitive) {
                if (eventError.statusCode >= 500) {
                    logger.error(`Uncaught error found`, eventError)
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
