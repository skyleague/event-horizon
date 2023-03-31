import type { LambdaContext } from '../types.js'

import { Logger as AWSLogger } from '@aws-lambda-powertools/logger'
import type { Context } from 'aws-lambda'

export function loggerContext(
    { logger, requestId, traceId }: LambdaContext,
    {
        logEvent = false,
        clearState = true,
    }: {
        logEvent?: boolean
        clearState?: boolean
    } = {}
) {
    return {
        before: (request: unknown, context: Context) => {
            AWSLogger.injectLambdaContextBefore(logger.instance, request, context, { logEvent, clearState })
            logger.setBindings({ requestId, traceId })
        },
    }
}
