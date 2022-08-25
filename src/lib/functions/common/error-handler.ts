import type { LambdaContext } from '../../events/context'
import { EventError } from '../../events/event-error'

import { isError } from '@skyleague/axioms'

export function errorHandler({ logger }: LambdaContext) {
    return {
        onError: (error: Error | unknown): void => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            logger.error(`Uncaught error found`, eventError)

            throw error
        },
    }
}
