import { snsParseEvent } from './functions/parse-event'
import type { SNSEvent, SNSHandler } from './types'

import { ioLogger } from '../functions/io-logger'
import { ioValidate } from '../functions/io-validate'
import type { LambdaContext } from '../types'

import type { Try } from '@skyleague/axioms'
import { enumerate, isFailure, mapTry } from '@skyleague/axioms'
import type { SNSEventRecord } from 'aws-lambda'

export async function handleSNSEvent(handler: SNSHandler, events: SNSEventRecord[], context: LambdaContext): Promise<Try<void>> {
    const { sns } = handler
    const parseEventFn = snsParseEvent(sns)
    const ioValidateFn = ioValidate<SNSEvent>({ input: (x) => x.payload })
    const ioLoggerFn = ioLogger({ type: 'sns' }, context)

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const snsEvent = mapTry(event, (e) => {
            const unvalidatedSnsEvent = parseEventFn.before(e)
            return ioValidateFn.before(sns.schema.payload, unvalidatedSnsEvent)
        })

        ioLoggerFn.before(snsEvent, item)

        const response = await mapTry(snsEvent, (success) => sns.handler(success, context))

        ioLoggerFn.after(undefined, item)

        if (isFailure(response)) {
            return response
        }
    }
}
