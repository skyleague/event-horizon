import type { Try } from '@skyleague/axioms'
import { EventError } from '../../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../../types.js'
import type { AuthorizerReponse } from '../types.js'

export function authorizerErrorHandler({ logger, isSensitive }: Pick<LambdaContext, 'isSensitive' | 'logger'>): {
    onError: (error: Error | unknown) => Try<AuthorizerReponse>
} {
    return {
        onError: (error: Error | unknown): Try<AuthorizerReponse> => {
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

            return new Error('Unauthorized', { cause: eventError })
        },
    }
}
