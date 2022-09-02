import type { EventBridgeEvent, EventBridgeHandler } from './types'

import { eventBridgeParseEvent } from '../../functions/eventbridge/parse-event'
import { ioLogger } from '../../functions/shared/io-logger'
import { ioValidate } from '../../functions/shared/io-validate'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda'

export async function handleEventBridgeEvent(
    handler: EventBridgeHandler,
    event: AWSEventBridgeEvent<string, unknown>,
    context: LambdaContext
): Promise<unknown> {
    if (!('eventBridge' in handler) || handler.eventBridge === undefined) {
        throw EventError.notImplemented()
    }
    const { eventBridge } = handler

    const parseEventFn = eventBridgeParseEvent(eventBridge)
    const ioValidateFn = ioValidate<EventBridgeEvent>({ input: (x) => x.payload })
    const ioLoggerFn = ioLogger({ type: 'eventbridge' }, context)

    const unvalidatedEbEvent = parseEventFn.before(event)
    const ebEvent = ioValidateFn.before(eventBridge.schema.payload, unvalidatedEbEvent)

    if ('left' in ebEvent) {
        throw EventError.badRequest(ebEvent.left[0].message)
    }

    ioLoggerFn.before(ebEvent)

    const response = await eventBridge.handler(ebEvent.right, context)

    ioLoggerFn.after(response)

    return response
}
