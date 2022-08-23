import type { LambdaContext } from '../../events/context'
import { HttpError } from '../../events/http/http-error'
import type { HttpResponse } from '../../events/http/types'

import { isError } from '@skyleague/axioms'

export function httpErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (error: Error | unknown): HttpResponse => {
            const httpError = HttpError.is(error) ? error : isError(error) ? new HttpError(error) : new HttpError('unknown')

            if (!isSensitive) {
                if (httpError.statusCode >= 500) {
                    logger.error(`Uncaught error found`, httpError)
                } else if (httpError.statusCode >= 400) {
                    logger.info('Client error found', httpError)
                } else {
                    logger.error(`Error found`, httpError)
                }
            }

            return {
                statusCode: httpError.statusCode,
                body: {
                    statusCode: httpError.statusCode,
                    message: httpError.expose && !isSensitive ? httpError.message : httpError.name,
                    stack: httpError.expose && !isSensitive ? httpError.stack : undefined,
                },
            }
        },
    }
}
