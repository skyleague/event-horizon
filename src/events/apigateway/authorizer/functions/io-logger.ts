import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'
import { loggingConstants } from '../../../../constants.js'
import type { MaybeGenericParser } from '../../../../parsers/types.js'
import type { EventFromHandler, LambdaContext } from '../../../types.js'
import type { GatewayVersion } from '../../event/types.js'
import type { AuthorizerReponse, RequestAuthorizerEventHandler, SecuritySchemes } from '../types.js'

export function authorizerIOLogger<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Context extends MaybeGenericParser,
    Security extends SecuritySchemes | undefined,
    GV extends GatewayVersion,
>({ logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        before: (
            request: Try<
                EventFromHandler<
                    RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>
                >
            >,
        ) => {
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
