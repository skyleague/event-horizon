import type { LambdaContext } from '../../events/context'

export function rawIOLogger({ logger, isSensitive }: LambdaContext) {
    return {
        before: (event: unknown) => {
            if (!isSensitive) {
                logger.info(`[raw] start`, { event })
            }
        },
        after: (response: unknown) => {
            if (!isSensitive) {
                logger.info(`[raw] sent `, { response })
            }
        },
    }
}
