import { eventBridgeParseEvent } from './functions/parse-event.js'
import type { EventBridgeEvent, EventBridgeHandler } from './types.js'

import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { mapTry } from '@skyleague/axioms'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda'

export async function handleEventBridgeEvent(
    handler: EventBridgeHandler,
    event: AWSEventBridgeEvent<string, unknown>,
    context: LambdaContext
): Promise<Try<unknown>> {
    const { eventBridge } = handler

    const parseEventFn = eventBridgeParseEvent()
    const ioValidateFn = ioValidate<EventBridgeEvent>({ input: (x) => x.payload })
    const ioLoggerFn = ioLogger({ type: 'eventbridge' }, context)

    const ebEvent = mapTry(event, (e) => {
        const unvalidatedEbEvent = parseEventFn.before(e)
        return ioValidateFn.before(eventBridge.schema.payload, unvalidatedEbEvent)
    })

    ioLoggerFn.before(ebEvent)

    const unvalidatedResponse = await mapTry(ebEvent, (e) => eventBridge.handler(e, context))
    const response = mapTry(unvalidatedResponse, (t) => ioValidateFn.after(eventBridge.schema.result, t))

    ioLoggerFn.after(response)

    return response
}
