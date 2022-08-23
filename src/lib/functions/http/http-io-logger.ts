import type { LambdaContext } from '../../events/context'
import type { HttpEventHandler, HttpRequest, HttpResponse } from '../../events/http/types'

export function httpIOLogger({ url }: HttpEventHandler, { logger, isSensitive }: LambdaContext) {
    return {
        before: (request: HttpRequest) => {
            if (!isSensitive) {
                logger.info(`[request] ${url} start`, { request })
            }
        },
        after: (response: HttpResponse) => {
            if (!isSensitive) {
                logger.info(`[response] ${url} sent ${response.statusCode}`, { response })
            }
        },
    }
}
