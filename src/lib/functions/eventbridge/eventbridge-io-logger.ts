import type { LambdaContext } from '../../events/context'

export function eventBridgeIOLogger({ logger, isSensitive }: LambdaContext) {
    return {
        before: (event: unknown) => {
            if (!isSensitive) {
                logger.info(`[eventbridge] start`, { event })
            }
        },
        after: (response: unknown) => {
            if (!isSensitive) {
                logger.info(`[eventbridge] sent `, { response })
            }
        },
    }
}
