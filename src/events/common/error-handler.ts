import { EventError } from '../../errors/event-error/index.js'
import type { LambdaContext } from '../types.js'

import { isError } from '@skyleague/axioms'

export function errorHandler({ logger }: LambdaContext) {
    return {
        onError: (error: Error | unknown): EventError => {
            return EventError.log(logger, error)
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
