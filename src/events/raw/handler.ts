import { EventError } from '../../errors/event-error'
import type { EventHandler } from '../../handlers/types'
import { ioLogger } from '../functions/io-logger'
import { ioValidate } from '../functions/io-validate'
import type { LambdaContext } from '../types'

import type { Try } from '@skyleague/axioms'
import { mapTry, tryAsValue } from '@skyleague/axioms'

export async function handleRawEvent(handler: EventHandler, event: unknown, context: LambdaContext): Promise<Try<{}>> {
    if (!('raw' in handler) || handler.raw === undefined) {
        return EventError.notImplemented()
    }

    const { raw } = handler
    const ioValidateFn = ioValidate()
    const ioLoggerFn = ioLogger({ type: 'raw' }, context)

    ioLoggerFn.before(event)

    const rawEvent = mapTry(event, (e) => ioValidateFn.before(raw.schema.payload, e))
    const response = await mapTry(rawEvent, (e) => raw.handler(e, context))

    ioLoggerFn.after(tryAsValue(response))

    return response
}
