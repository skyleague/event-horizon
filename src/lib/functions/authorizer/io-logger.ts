import type { LambdaContext } from '../../events/context'
import type { HttpEventHandler, HttpRequest, HttpResponse } from '../../events/http/types'

export function httpIOLogger({ path }: HttpEventHandler, { logger, isSensitive }: LambdaContext) {
    return {
        before: (request: HttpRequest) => {
            if (!isSensitive) {
                logger.info(`[request] ${path} start`, { request })
            }
        },
        after: (response: HttpResponse) => {
            if (!isSensitive) {
                logger.info(`[response] ${path} sent ${response.statusCode}`, { response })
            }
        },
    }
}
