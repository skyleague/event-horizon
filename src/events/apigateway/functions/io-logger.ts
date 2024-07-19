import type { LambdaContext } from '../../types.js'
import type { GatewayVersion, HTTPEmptyResponse, HTTPEventHandler, HTTPRequest, HTTPResponse, Responses } from '../types.js'
import type { HttpError } from './http-error.type.js'

import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'
import { loggingConstants } from '../../../constants.js'

export function httpIOLogger<
    Configuration,
    Service,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result extends Responses,
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
                        ? loggingConstants.logEventPayload
                            ? { request: pick(request, ['path', 'query']) }
                            : {}
                        : { error: request },
                )
            }
        },
        after: (response: Try<HTTPResponse<number, HttpError | unknown> | HTTPEmptyResponse<number>>) => {
            if (!isSensitive) {
                if (isSuccess(response)) {
                    logger.info(
                        `[http] ${path} sent ${response.statusCode.toString()}`,
                        loggingConstants.logResultPayload ? { response: pick(response, ['statusCode']) } : {},
                    )
                } else {
                    logger.info(`[http] ${path} sent`, { error: response })
                }
            }
        },
    }
}
