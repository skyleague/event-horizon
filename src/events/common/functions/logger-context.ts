import { Logger as AWSLogger } from '@aws-lambda-powertools/logger'
import type { Context } from 'aws-lambda'
import type { LambdaContext } from '../../types.js'

function envToCamelcase(name: string) {
    return name.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}
const prefix = 'EH_LOGGER_CONTEXT_'

export function loggerContext(
    { logger, requestId, traceId }: LambdaContext,
    {
        logEvent = false,
        clearState = true,
    }: {
        logEvent?: boolean
        clearState?: boolean
    } = {},
) {
    return {
        before: (request: unknown, context: Context) => {
            AWSLogger.injectLambdaContextBefore(logger.instance, request, context, { logEvent, clearState })

            const envBindings = Object.fromEntries(
                Object.entries(process.env ?? {})
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [envToCamelcase(key.slice(prefix.length)), value]),
            )

            logger.setBindings({ ...envBindings, requestId, traceId })
        },
    }
}
