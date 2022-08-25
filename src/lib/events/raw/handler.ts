import type { RawEventHandler } from './types'

import { rawIOLogger } from '../../functions/raw/raw-io-logger'
import { rawValidateRequest } from '../../functions/raw/raw-validate-request'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

export async function handleRawEvent(raw: RawEventHandler | undefined, event: unknown, context: LambdaContext): Promise<unknown> {
    if (raw === undefined) {
        throw EventError.notImplemented()
    }

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
