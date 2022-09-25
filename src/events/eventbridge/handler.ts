import { eventBridgeParseEvent } from './functions/parse-event'
import type { EventBridgeEvent, EventBridgeHandler } from './types'

import { EventError } from '../../errors/event-error'
import { ioLogger } from '../functions/io-logger'
import { ioValidate } from '../functions/io-validate'
import type { LambdaContext } from '../types'

import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda'

export async function handleEventBridgeEvent(
    handler: EventBridgeHandler,
    event: AWSEventBridgeEvent<string, unknown>,
    context: LambdaContext
): Promise<unknown> {
    const { eventBridge } = handler

    const parseEventFn = eventBridgeParseEvent(eventBridge)
    const ioValidateFn = ioValidate<EventBridgeEvent>({ input: (x) => x.payload })
    const ioLoggerFn = ioLogger({ type: 'eventbridge' }, context)

    const unvalidatedEbEvent = parseEventFn.before(event)
    const ebEvent = ioValidateFn.before(eventBridge.schema.payload, unvalidatedEbEvent)

    if ('left' in ebEvent) {
        throw EventError.badRequest(ebEvent.left[0].message)
    }

    ioLoggerFn.before(ebEvent.right)

    const response = await eventBridge.handler(ebEvent.right, context)

    ioLoggerFn.after(response)

    return response
}
