import { constants } from '../../../constants'
import type { LambdaContext } from '../../types'
import type { HTTPEventHandler, HTTPRequest, HTTPResponse } from '../types'

import type { Try } from '@skyleague/axioms'
import { isSuccess, pick } from '@skyleague/axioms'

export function httpIOLogger({ path }: HTTPEventHandler, { logger, isSensitive }: LambdaContext) {
    return {
        before: (request: Try<HTTPRequest>) => {
            if (!isSensitive) {
                logger.info(
                    `[http] ${path} start`,
                    isSuccess(request)
                        ? constants.logEventPayload
                            ? { request: pick(request, ['path', 'query']) }
                            : {}
                        : { error: request }
                )
            }
        },
        after: (response: Try<HTTPResponse>) => {
            if (!isSensitive) {
                if (isSuccess(response)) {
                    logger.info(
                        `[http] ${path} sent ${response.statusCode}`,
                        constants.logResultPayload ? { response: pick(response, ['statusCode']) } : {}
                    )
                } else {
                    logger.info(`[http] ${path} sent`, { error: response })
                }
            }
        },
    }
}
