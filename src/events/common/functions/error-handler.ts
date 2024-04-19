import { EventError } from '../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../types.js'

import { isError } from '@skyleague/axioms'

export function errorHandler({ logger }: LambdaContext): {
    onError: (error: Error | unknown) => EventError
    onExit: (response: Error) => unknown
} {
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
