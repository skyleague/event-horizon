import type { Try } from '@skyleague/axioms'
import { isFailure, mapTry } from '@skyleague/axioms'
import type { SnsRecordSchema } from '../../dev/aws/sns/sns.type.js'
import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'
import { snsParseEvent } from './functions/parse-event.js'
import type { SNSEvent, SNSHandler } from './types.js'

export async function handleSNSEvent<Configuration, Service, Profile, Payload>(
    handler: SNSHandler<Configuration, Service, Profile, Payload>,
    events: SnsRecordSchema[],
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<void>> {
    const { sns } = handler
    const parseEventFn = snsParseEvent(sns)
    const ioValidateFn = ioValidate<SNSEvent>()
    const ioLoggerFn = ioLogger({ type: 'sns' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    for (const [i, event] of events.entries()) {
        const item = { item: i }

        const snsEvent = mapTry(event, (e) => {
            const unvalidatedSnsEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                messageId: unvalidatedSnsEvent.raw.MessageId,
            })

            return ioValidateFn.before(sns.schema.payload, unvalidatedSnsEvent, 'payload')
        })

        ioLoggerFn.before(snsEvent, item)

        const response = await mapTry(snsEvent, (success) => sns.handler(success, context))

        ioLoggerFn.after(undefined, item)
        ioLoggerChildFn.after()

        if (isFailure(response)) {
            return response
        }
    }
}
