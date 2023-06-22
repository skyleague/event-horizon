import { EventError } from '../../../errors/event-error/index.js'
import type { LambdaContext } from '../../types.js'

import { isError } from '@skyleague/axioms'

export function pipeErrorHandler({ logger, isSensitive }: LambdaContext) {
    return {
        onError: (original: unknown, error: Error | unknown) => {
            const eventError = EventError.is(error) ? error : isError(error) ? new EventError(error) : new EventError('unknown')

            if (!isSensitive) {
                logger.error(`Uncaught error found`, eventError)
            }

            return eventError
        },
    }
}
