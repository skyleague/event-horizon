import { serviceConstants } from '../../../../constants.js'
import { EventError } from '../../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../../types.js'
import type { HTTPResponse } from '../types.js'
import type { HttpError } from './http-error.type.js'

export function httpErrorHandler<Code extends number = number, HttpErrorType = HttpError>(
    { logger, isSensitive }: Pick<LambdaContext, 'isSensitive' | 'logger'>,
    httpErrorSeralizer: (error: EventError) => HTTPResponse<Code, HttpErrorType> = (eventError) => ({
        statusCode: eventError.statusCode as Code,
        body: {
            statusCode: eventError.statusCode,
            message: eventError.expose && !isSensitive ? eventError.message : eventError.name,
            stack:
                serviceConstants.isDebug && eventError.expose && eventError.isServerError && !isSensitive
                    ? eventError.stack
                    : undefined,
        } as HttpErrorType,
    }),
): { onError: (error: Error | unknown) => HTTPResponse<Code, HttpErrorType> } {
    return {
        onError: (error: Error | unknown): HTTPResponse<Code, HttpErrorType> => {
            const eventError = EventError.from(error)

            if (!isSensitive) {
                if (eventError.statusCode >= 500) {
                    logger.error('Error found', eventError)
                } else if (eventError.statusCode >= 400) {
                    logger.info('Client error found', eventError)
                } else {
                    logger.error('Error found', eventError)
                }
            }

            return httpErrorSeralizer(eventError)
        },
    }
}
