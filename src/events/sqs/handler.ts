import { sqsErrorHandler } from './functions/error-handler.js'
import { sqsParseEvent } from './functions/parse-event.js'
import type { SQSEvent, SQSHandler } from './types.js'

import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import { eitherAsValue, enumerate, isLeft, mapLeft, mapTry, tryToEither } from '@skyleague/axioms'
import type { SQSBatchItemFailure, SQSBatchResponse, SQSRecord } from 'aws-lambda'

export async function handleSQSEvent<Configuration, Service, Profile, Payload>(
    handler: SQSHandler<Configuration, Service, Profile, Payload>,
    events: SQSRecord[],
    context: LambdaContext<Configuration, Service, Profile>
): Promise<SQSBatchResponse | void> {
    const { sqs } = handler

    const errorHandlerFn = sqsErrorHandler(context)
    const parseEventFn = sqsParseEvent(sqs)
    const ioValidateFn = ioValidate<SQSEvent>()
    const ioLoggerFn = ioLogger({ type: 'sqs' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    let failures: SQSBatchItemFailure[] | undefined = undefined
    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const sqsEvent = mapTry(event, (e) => {
            const unvalidatedSQSEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                messageId: unvalidatedSQSEvent.raw.messageId,
            })

            return ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent, 'payload')
        })

        ioLoggerFn.before(sqsEvent, item)

        const transformed = await mapTry(sqsEvent, (success) => sqs.handler(success, context))

        const eitherTransformed = tryToEither(transformed)
        const response = mapLeft(eitherTransformed, (e) => errorHandlerFn.onError(event, e))

        ioLoggerFn.after(eitherAsValue(response), item)
        ioLoggerChildFn.after()

        if (isLeft(response)) {
            failures ??= []
            failures.push(response.left)
        }
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
}
