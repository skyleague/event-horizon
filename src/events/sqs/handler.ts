import type { SQSEvent, SQSHandler } from './types'

import { EventError } from '../../errors/event-error'
import { ioLogger } from '../../functions/shared/io-logger'
import { ioValidate } from '../../functions/shared/io-validate'
import { sqsErrorHandler } from '../../functions/sqs/error-handler'
import { sqsParseEvent } from '../../functions/sqs/parse-event'
import type { LambdaContext } from '../types'

import type { Maybe } from '@skyleague/axioms'
import { enumerate, isJust, Nothing } from '@skyleague/axioms'
import type { SQSBatchItemFailure, SQSBatchResponse, SQSRecord } from 'aws-lambda'

export async function handleSqsEvent(
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

        let maybeFailure: Maybe<SQSBatchItemFailure> = Nothing
        try {
            const unvalidatedSQSEvent = parseEventFn.before(event)
            const sqsEvent = ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent)

            if ('left' in sqsEvent) {
                throw EventError.badRequest(sqsEvent.left[0].message)
            }
            ioLoggerFn.before(sqsEvent, item)

            await sqs.handler(sqsEvent.right, context)
        } catch (e: unknown) {
            maybeFailure = errorHandlerFn.onError(event, e)
        }
        ioLoggerFn.after(undefined, item)

        if (isJust(maybeFailure)) {
            failures ??= []
            failures.push(maybeFailure)
        }
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
    return
}
