import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'
import { loggingConstants } from '../../../../constants.js'
import type { LambdaContext } from '../../../types.js'
import type { AuthorizerReponse, RequestAuthorizerEvent } from '../types.js'

export function authorizerIOLogger<Event extends RequestAuthorizerEvent>({
    logger,
    isSensitive,
}: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        before: (request: Try<Event>) => {
            if (!isSensitive) {
                logger.info(
                    '[authorizer] start',
                    isSuccess(request)
                        ? loggingConstants.logEventPayload
                            ? { request: pick(request, ['path', 'query']) }
                            : {}
                        : { error: request },
                )
            }
        },
        after: (response: Try<AuthorizerReponse>) => {
            if (!isSensitive) {
                if (isSuccess(response)) {
                    logger.info('[authorizer] sent', loggingConstants.logResultPayload ? { response } : {})
                } else {
                    logger.info('[authorizer] sent', { error: response })
                }
            }
        },
    }
}
