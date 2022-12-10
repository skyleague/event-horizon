import { EventError } from '../../errors/event-error'
import type { LambdaContext } from '../types'

import { isError } from '@skyleague/axioms'

export function errorHandler({ logger }: LambdaContext) {
    return {
        onError: (error: Error | unknown): EventError => {
            const eventError = EventError.from(error)

            if (eventError.level === 'error') {
                logger.error(`Uncaught error found`, eventError)
            } else if (eventError.level === 'warning') {
                logger.warn('Warning found', eventError)
            } else {
                logger.info(`Warning found`, eventError)
            }
            return eventError
        },
        onExit: (response: Error): unknown => {
            if (isError(response)) {
                const eventError = EventError.from(response)
                if (eventError.errorHandling === 'graceful') {
                    return {}
                }
            }
            return response
        },
    }
}
