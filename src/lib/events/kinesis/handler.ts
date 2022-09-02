import type { KinesisEvent } from './types'

import type { EventHandler } from '../../event'
import { kinesisParseEvent } from '../../functions/kinesis/parse-event'
import { ioLogger } from '../../functions/shared/io-logger'
import { ioValidate } from '../../functions/shared/io-validate'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import { enumerate } from '@skyleague/axioms'
import type { KinesisStreamBatchResponse, KinesisStreamRecord } from 'aws-lambda'

export async function handleKinesisEvent(
    handler: EventHandler,
    events: KinesisStreamRecord[],
    context: LambdaContext
): Promise<KinesisStreamBatchResponse | void> {
    if (!('kinesis' in handler) || handler.kinesis === undefined) {
        throw EventError.notImplemented()
    }
    const { kinesis } = handler

    const parseEventFn = kinesisParseEvent(kinesis)
    const ioValidateFn = ioValidate<KinesisEvent>({ input: (e) => e.payload })
    const ioLoggerFn = ioLogger({ type: 'sns' }, context)

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const unvalidatedKinesisEvent = parseEventFn.before(event)
        const kinesisEvent = ioValidateFn.before(kinesis.schema.payload, unvalidatedKinesisEvent)

        if ('left' in kinesisEvent) {
            throw EventError.badRequest(kinesisEvent.left[0].message)
        }
        ioLoggerFn.before(kinesisEvent, item)

        await kinesis.handler(kinesisEvent.right, context)

        ioLoggerFn.after(undefined, item)
    }
}
