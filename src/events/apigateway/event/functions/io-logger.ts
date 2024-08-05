import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'
import { loggingConstants } from '../../../../constants.js'
import type { LambdaContext } from '../../../types.js'
import type { HTTPEmptyResponse, HTTPEventHandler, HTTPRequest, HTTPResponse } from '../types.js'
import type { HttpError } from './http-error.type.js'

export function httpIOLogger<Handler extends HTTPEventHandler>(
    { path }: Handler,
    { logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>,
) {
    const pathPrefix = path !== undefined ? `${path} ` : undefined
    return {
        before: (request: Try<HTTPRequest>) => {
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
        after: (response: Try<HTTPResponse<number, HttpError | unknown> | HTTPEmptyResponse<number>>) => {
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
