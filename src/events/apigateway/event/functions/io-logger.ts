import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'
import { loggingConstants } from '../../../../constants.js'
import type { MaybeGenericParser } from '../../../../parsers/types.js'
import type { EventFromHandler, LambdaContext, ResponseFromHandler } from '../../../types.js'
import type { SecurityRequirements } from '../../types.js'
import type { AuthorizerSchema, GatewayVersion, HTTPEventHandler, Responses } from '../types.js'

export function httpIOLogger<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Body extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Result extends Responses,
    Security extends SecurityRequirements | undefined,
    GV extends GatewayVersion,
    Authorizer extends AuthorizerSchema<GV>,
>(
    { path }: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV, Authorizer>,
    { logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>,
) {
    const pathPrefix = path !== undefined ? `${path} ` : ''
    return {
        before: (
            request: Try<
                EventFromHandler<
                    HTTPEventHandler<
                        Configuration,
                        Service,
                        Profile,
                        Body,
                        Path,
                        Query,
                        Headers,
                        Result,
                        Security,
                        GV,
                        Authorizer
                    >
                >
            >,
        ) => {
            if (!isSensitive) {
                logger.info(
                    `[http] ${pathPrefix}start`,
                    isSuccess(request)
                        ? loggingConstants.logEventPayload
                            ? { request: pick(request, ['path', 'query']) }
                            : {}
                        : { error: request },
                )
            }
        },
        after: (
            response: Awaited<
                ResponseFromHandler<
                    HTTPEventHandler<
                        Configuration,
                        Service,
                        Profile,
                        Body,
                        Path,
                        Query,
                        Headers,
                        Result,
                        Security,
                        GV,
                        Authorizer
                    >
                >
            >,
        ) => {
            if (!isSensitive) {
                if (isSuccess(response)) {
                    logger.info(
                        `[http] ${pathPrefix}sent ${response.statusCode.toString()}`,
                        loggingConstants.logResultPayload ? { response: pick(response, ['statusCode']) } : {},
                    )
                } else {
                    logger.info(`[http] ${pathPrefix}sent`, { error: response })
                }
            }
        },
    }
}
