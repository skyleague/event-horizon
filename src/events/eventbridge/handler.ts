import { eventBridgeParseEvent } from './functions/parse-event.js'
import type { EventBridgeEvent, EventBridgeHandler } from './types.js'

import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { DefaultServices, LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { mapTry } from '@skyleague/axioms'
import type { UndefinedOnPartialDeep } from '@skyleague/axioms/types'
import type { EventBridgeEvent as AWSEventBridgeEvent } from 'aws-lambda'

export async function handleEventBridgeEvent<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile,
    Payload,
    Result,
>(
    handler: EventBridgeHandler<Configuration, Service, Profile, Payload, Result>,
    event: UndefinedOnPartialDeep<AWSEventBridgeEvent<string, unknown>>,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<unknown>> {
    const { eventBridge } = handler

    const parseEventFn = eventBridgeParseEvent()
    const ioValidateFn = ioValidate<EventBridgeEvent>()
    const ioLoggerFn = ioLogger({ type: 'eventbridge' }, context)

    const ebEvent = mapTry(event, (e): EventBridgeEvent<Payload> => {
        const unvalidatedEbEvent = parseEventFn.before(e)
        return ioValidateFn.before<Payload, 'payload', EventBridgeEvent<Payload>>(
            eventBridge.schema.payload,
            unvalidatedEbEvent,
            'payload',
        )
    })

    ioLoggerFn.before(ebEvent)

    const unvalidatedResponse = await mapTry(ebEvent, (e) => eventBridge.handler(e, context))
    const response = mapTry(unvalidatedResponse, (t) => ioValidateFn.after(eventBridge.schema.result, t))

    ioLoggerFn.after(response)

    return response
}
