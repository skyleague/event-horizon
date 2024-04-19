import type { HttpError } from './http-error.type.js'

import { constants } from '../../../constants.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../types.js'
import type { HTTPResponse } from '../types.js'

import { omitUndefined } from '@skyleague/axioms'
export function httpErrorHandler<HttpErrorType = HttpError>(
    { logger, isSensitive }: Pick<LambdaContext, 'isSensitive' | 'logger'>,
    httpErrorSeralizer: (error: EventError) => HTTPResponse<HttpErrorType> = (eventError) => ({
        statusCode: eventError.statusCode,
        body: omitUndefined({
            statusCode: eventError.statusCode,
            message: eventError.expose && !isSensitive ? eventError.message : eventError.name,
            stack:
                constants.isDebug && eventError.expose && eventError.isServerError && !isSensitive ? eventError.stack : undefined,
        }) as HttpErrorType,
    })
): { onError: (error: Error | unknown) => HTTPResponse<HttpErrorType> } {
    return {
        onError: (error: Error | unknown): HTTPResponse<HttpErrorType> => {
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

            return httpErrorSeralizer(eventError)
        },
    }
}
