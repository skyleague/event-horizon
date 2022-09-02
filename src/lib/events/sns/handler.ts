import type { SNSEvent } from './types'

import type { EventHandler } from '../../event'
import { ioLogger } from '../../functions/shared/io-logger'
import { ioValidate } from '../../functions/shared/io-validate'
import { snsParseEvent } from '../../functions/sns/parse-event'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import { enumerate } from '@skyleague/axioms'
import type { SNSEventRecord } from 'aws-lambda'

export async function handleSnsEvent(handler: EventHandler, events: SNSEventRecord[], context: LambdaContext): Promise<void> {
    if (!('sns' in handler) || handler.sns === undefined) {
        throw EventError.notImplemented()
    }
    const { sns } = handler
    const parseEventFn = snsParseEvent(sns)
    const ioValidateFn = ioValidate<SNSEvent>({ input: (x) => x.payload })
    const ioLoggerFn = ioLogger({ type: 'sns' }, context)

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const unvalidatedSnsEvent = parseEventFn.before(event)
        const snsEvent = ioValidateFn.before(sns.schema.payload, unvalidatedSnsEvent)

        if ('left' in snsEvent) {
            throw EventError.badRequest(snsEvent.left[0].message)
        }

        ioLoggerFn.before(sns, item)

        await sns.handler(snsEvent.right, context)

        ioLoggerFn.after(undefined, item)
    }
}