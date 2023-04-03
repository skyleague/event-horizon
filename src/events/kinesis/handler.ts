import { kinesisErrorHandler } from './functions/error-handler.js'
import { kinesisParseEvent } from './functions/parse-event.js'
import type { KinesisEvent, KinesisHandler } from './types.js'

import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { enumerate, isLeft, mapLeft, mapTry, tryToEither, tryAsValue } from '@skyleague/axioms'
import type { KinesisStreamBatchItemFailure, KinesisStreamBatchResponse, KinesisStreamRecord } from 'aws-lambda'

export async function handleKinesisEvent(
    handler: KinesisHandler,
    events: KinesisStreamRecord[],
    context: LambdaContext
): Promise<Try<KinesisStreamBatchResponse | void>> {
    const { kinesis } = handler

    const errorHandlerFn = kinesisErrorHandler(context)
    const parseEventFn = kinesisParseEvent(kinesis)
    const ioValidateFn = ioValidate<KinesisEvent>({ input: (e) => e.payload })
    const ioLoggerFn = ioLogger({ type: 'kinesis' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    let failures: KinesisStreamBatchItemFailure[] | undefined = undefined

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const kinesisEvent = mapTry(event, (e) => {
            const unvalidatedKinesisEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                eventId: unvalidatedKinesisEvent.raw.eventID,
            })

            return ioValidateFn.before(kinesis.schema.payload, unvalidatedKinesisEvent)
        })

        ioLoggerFn.before(tryAsValue(kinesisEvent), item)

        const transformed = await mapTry(kinesisEvent, (e) => kinesis.handler(e, context))

        const response = mapLeft(tryToEither(transformed), (e) => errorHandlerFn.onError(event, e))

        if (isLeft(response)) {
            ioLoggerFn.after(response.left, item)
            failures ??= []
            failures.push(response.left)
        } else {
            ioLoggerFn.after(undefined, item)
        }

        ioLoggerChildFn.after()
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
}
