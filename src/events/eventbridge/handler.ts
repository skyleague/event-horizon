import type { Try } from '@skyleague/axioms'
import { mapTry } from '@skyleague/axioms'
import type { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { DefaultServices, LambdaContext } from '../types.js'
import { eventBridgeParseEvent } from './functions/parse-event.js'
import type { EventBridgeEvent, EventBridgeHandler } from './types.js'

export async function handleEventBridgeEvent<
    const Configuration,
    const Service extends DefaultServices | undefined,
    const Profile extends MaybeGenericParser,
    const Payload extends MaybeGenericParser,
    const Result extends MaybeGenericParser,
>(
    handler: EventBridgeHandler<Configuration, Service, Profile, Payload, Result>,
    event: EventBridgeSchema,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<unknown>> {
    const { eventBridge } = handler

    const parseEventFn = eventBridgeParseEvent()
    const ioValidateFn = ioValidate<EventBridgeEvent>()
    const ioLoggerFn = ioLogger({ type: 'eventbridge' }, context)

    const ebEvent = await mapTry(event, (e) => {
        const unvalidatedEbEvent = parseEventFn.before(e)
        return ioValidateFn.before(eventBridge.schema.payload, unvalidatedEbEvent, 'payload')
    })

    ioLoggerFn.before(ebEvent)

    const unvalidatedResponse = await mapTry(ebEvent, (e) => eventBridge.handler(e, context))
    const response = await mapTry(unvalidatedResponse, (t) => ioValidateFn.after(eventBridge.schema.result, t))

    ioLoggerFn.after(response)

    return response
}
