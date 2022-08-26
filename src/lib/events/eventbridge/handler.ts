import type { EventBridgeHandler } from './types'

import { eventBridgeIOLogger } from '../../functions/eventbridge/eventbridge-io-logger'
import { eventBridgeParseEvent } from '../../functions/eventbridge/eventbridge-parse-event'
import { eventBridgeValidateRequest } from '../../functions/eventbridge/eventbridge-validate-request'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda'

export async function handleEventBridgeEvent(
    eventBridge: EventBridgeHandler | undefined,
    event: AWSEventBridgeEvent<string, unknown>,
    context: LambdaContext
): Promise<unknown> {
    if (eventBridge === undefined) {
        throw EventError.notImplemented()
    }

    const parseEventFn = eventBridgeParseEvent(eventBridge)
    const validateRequestFn = eventBridgeValidateRequest()
    const inputOutputFn = eventBridgeIOLogger(context)

    const unvalidatedEbEvent = parseEventFn.before(event)
    inputOutputFn.before(unvalidatedEbEvent)
    const ebEvent = validateRequestFn.before(eventBridge, unvalidatedEbEvent)

    if ('left' in ebEvent) {
        throw EventError.badRequest(ebEvent.left[0].message)
    }

    const response = await eventBridge.handler(ebEvent.right, context)

    inputOutputFn.after(response)

    return response
}
