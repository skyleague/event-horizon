import { kinesisErrorHandler } from './functions/error-handler'
import { kinesisParseEvent } from './functions/parse-event'
import type { KinesisEvent, KinesisHandler } from './types'

import { ioLogger } from '../functions/io-logger'
import { ioValidate } from '../functions/io-validate'
import type { LambdaContext } from '../types'

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

    let failures: KinesisStreamBatchItemFailure[] | undefined = undefined

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const kinesisEvent = mapTry(event, (e) => {
            const unvalidatedKinesisEvent = parseEventFn.before(e)
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
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
}
