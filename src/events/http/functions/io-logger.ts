import type { HttpError } from './http-error.type.js'

import { constants } from '../../../constants.js'
import type { LambdaContext } from '../../types.js'
import type { GatewayVersion, HTTPEventHandler, HTTPRequest, HTTPResponse } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'

export function httpIOLogger<
    Configuration,
    Service,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result,
    GV extends GatewayVersion = 'http',
>(
    { path }: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>,
    { logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>,
) {
    return {
        before: (request: Try<HTTPRequest<Body, Path, Query, Headers, GV>>) => {
            if (!isSensitive) {
                logger.info(
                    `[http] ${path} start`,
                    isSuccess(request)
                        ? constants.logEventPayload
                            ? { request: pick(request, ['path', 'query']) }
                            : {}
                        : { error: request },
                )
            }
        },
        after: (response: Try<HTTPResponse<HttpError | Result>>) => {
            if (!isSensitive) {
                if (isSuccess(response)) {
                    logger.info(
                        `[http] ${path} sent ${response.statusCode.toString()}`,
                        constants.logResultPayload ? { response: pick(response, ['statusCode']) } : {},
                    )
                } else {
                    logger.info(`[http] ${path} sent`, { error: response })
                }
            }
        },
    }
}
