import { EventError } from '../../errors/event-error'
import type { LambdaContext } from '../types'

import { isError } from '@skyleague/axioms'

export function errorHandler({ logger }: LambdaContext) {
    return {
        onError: (error: Error | unknown): void => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            if (eventError.isServerError) {
                logger.error(`Uncaught error found`, eventError)
            } else if (eventError.isClientError) {
                logger.warn(`Warning received`, eventError)
            }
        },
    }
}
