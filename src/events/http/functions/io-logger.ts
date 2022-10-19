import { logEventPayload, logResultPayload } from '../../../constants'
import type { LambdaContext } from '../../types'
import type { HttpEventHandler, HttpRequest, HttpResponse } from '../types'

import { pick } from '@skyleague/axioms'

export function httpIOLogger({ path }: HttpEventHandler, { logger, isSensitive }: LambdaContext) {
    return {
        before: (request: HttpRequest) => {
            if (!isSensitive) {
                logger.info(`[request] ${path} start`, logEventPayload ? { request: pick(request, ['pathParams', 'query']) } : {})
            }
        },
        after: (response: HttpResponse) => {
            if (!isSensitive) {
                logger.info(
                    `[response] ${path} sent ${response.statusCode}`,
                    logResultPayload ? { response: pick(response, ['statusCode']) } : {}
                )
            }
        },
    }
}