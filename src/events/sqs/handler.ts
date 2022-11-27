import { sqsErrorHandler } from './functions/error-handler'
import { sqsParseEvent } from './functions/parse-event'
import type { SQSEvent, SQSHandler } from './types'

import { ioLogger } from '../functions/io-logger'
import { ioValidate } from '../functions/io-validate'
import type { LambdaContext } from '../types'

import { eitherAsValue, enumerate, isLeft, mapLeft, mapTry, tryToEither } from '@skyleague/axioms'
import type { SQSBatchItemFailure, SQSBatchResponse, SQSRecord } from 'aws-lambda'

export async function handleSQSEvent(
    handler: SQSHandler,
    events: SQSRecord[],
    context: LambdaContext
): Promise<SQSBatchResponse | void> {
    const { sqs } = handler

    const errorHandlerFn = sqsErrorHandler(context)
    const parseEventFn = sqsParseEvent(sqs)
    const ioValidateFn = ioValidate<SQSEvent>({ input: (e) => e.payload })
    const ioLoggerFn = ioLogger({ type: 'sqs' }, context)

    let failures: SQSBatchItemFailure[] | undefined = undefined
    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const sqsEvent = mapTry(event, (e) => {
            const unvalidatedSQSEvent = parseEventFn.before(e)
            return ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent)
        })

        ioLoggerFn.before(sqsEvent, item)

        const transformed = await mapTry(sqsEvent, (success) => sqs.handler(success, context))

        const eitherTransformed = tryToEither(transformed)
        const response = mapLeft(eitherTransformed, (e) => errorHandlerFn.onError(event, e))

        ioLoggerFn.after(eitherAsValue(response), item)

        if (isLeft(response)) {
            failures ??= []
            failures.push(response.left)
        }
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
    return
}
