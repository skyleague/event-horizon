import type { EventHandler } from '../../event'
import { rawIOLogger } from '../../functions/raw/raw-io-logger'
import { rawValidateRequest } from '../../functions/raw/raw-validate-request'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

export async function handleRawEvent(handler: EventHandler, event: unknown, context: LambdaContext): Promise<unknown> {
    if (!('raw' in handler) || handler.raw === undefined) {
        throw EventError.notImplemented()
    }
    const { raw } = handler
    const validateRequestFn = rawValidateRequest()
    const inputOutputFn = rawIOLogger(context)

    inputOutputFn.before(raw)
    const rawEvent = validateRequestFn.before(raw, event)

    if ('left' in rawEvent) {
        throw EventError.badRequest(rawEvent.left[0].message)
    }

    const response = await raw.handler(rawEvent.right, context)

    inputOutputFn.after(response)

    return response
}
