import type { LambdaContext } from '../../events/context'
import { HttpError } from '../../events/http/http-error'

import { isError } from '@skyleague/axioms'

export function errorHandler({ logger }: LambdaContext) {
    return {
        onError: (error: Error | unknown): void => {
            const httpError = HttpError.is(error) ? error : isError(error) ? new HttpError(error) : new HttpError('unknown')

            logger.error(`Uncaught error found`, httpError)

            throw error
        },
    }
}
