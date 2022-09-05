import { isDebug } from '../../constants'
import type { LambdaContext } from '../../events/context'
import { EventError } from '../../events/event-error'
import type { HttpResponse } from '../../events/http/types'

import { isError } from '@skyleague/axioms'

export function httpErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (error: Error | unknown): HttpResponse => {
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
                    stack: isDebug && eventError.expose && !isSensitive ? eventError.stack : undefined,
                },
            }
        },
    }
}
