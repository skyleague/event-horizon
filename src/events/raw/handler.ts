import { EventError } from '../../errors/event-error/index.js'
import type { EventHandler } from '../../handlers/types.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { mapTry, tryAsValue } from '@skyleague/axioms'

export async function handleRawEvent(handler: EventHandler, event: unknown, context: LambdaContext): Promise<Try<{}>> {
    if (!('raw' in handler)) {
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
