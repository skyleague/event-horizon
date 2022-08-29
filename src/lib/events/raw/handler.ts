import type { EventHandler } from '../../event'
import { ioLogger } from '../../functions/shared/io-logger'
import { ioValidate } from '../../functions/shared/io-validate'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

export async function handleRawEvent(handler: EventHandler, event: unknown, context: LambdaContext): Promise<unknown> {
    if (!('raw' in handler) || handler.raw === undefined) {
        throw EventError.notImplemented()
    }
    const { raw } = handler
    const ioValidateFn = ioValidate()
    const ioLoggerFn = ioLogger({ type: 'raw' }, context)

    ioLoggerFn.before(raw)
    const rawEvent = ioValidateFn.before(raw.schema.event, event)

    if ('left' in rawEvent) {
        throw EventError.badRequest(rawEvent.left[0].message)
    }

    const response = await raw.handler(rawEvent.right, context)

    ioLoggerFn.after(response)

    return response
}
