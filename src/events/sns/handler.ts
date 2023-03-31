import { snsParseEvent } from './functions/parse-event.js'
import type { SNSEvent, SNSHandler } from './types.js'

import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { enumerate, isFailure, mapTry } from '@skyleague/axioms'
import type { SNSEventRecord } from 'aws-lambda'

export async function handleSNSEvent(handler: SNSHandler, events: SNSEventRecord[], context: LambdaContext): Promise<Try<void>> {
    const { sns } = handler
    const parseEventFn = snsParseEvent(sns)
    const ioValidateFn = ioValidate<SNSEvent>({ input: (x) => x.payload })
    const ioLoggerFn = ioLogger({ type: 'sns' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const snsEvent = mapTry(event, (e) => {
            const unvalidatedSnsEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                messageId: unvalidatedSnsEvent.raw.Sns.MessageId,
            })

            return ioValidateFn.before(sns.schema.payload, unvalidatedSnsEvent)
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
