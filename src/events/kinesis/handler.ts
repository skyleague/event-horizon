import type { Try } from '@skyleague/axioms'
import { isLeft, mapLeft, mapTry, tryAsValue, tryToEither } from '@skyleague/axioms'
import type { KinesisStreamBatchItemFailure, KinesisStreamBatchResponse } from 'aws-lambda'
import type { KinesisDataStreamRecord } from '../../aws/kinesis/kinesis.type.js'
import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'
import { kinesisErrorHandler } from './functions/error-handler.js'
import { kinesisParseEvent } from './functions/parse-event.js'
import type { KinesisEvent, KinesisHandler } from './types.js'

export async function handleKinesisEvent<Configuration, Service, Profile, Payload>(
    handler: KinesisHandler<Configuration, Service, Profile, Payload>,
    events: KinesisDataStreamRecord[],
    context: LambdaContext<Configuration, Service, Profile>,
    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
): Promise<Try<KinesisStreamBatchResponse | void>> {
    const { kinesis } = handler

    const errorHandlerFn = kinesisErrorHandler(context)
    const parseEventFn = kinesisParseEvent(kinesis)
    const ioValidateFn = ioValidate<KinesisEvent>()
    const ioLoggerFn = ioLogger({ type: 'kinesis' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    let failures: KinesisStreamBatchItemFailure[] | undefined = undefined

    for (const [i, event] of events.entries()) {
        const item = { item: i }

        const kinesisEvent = mapTry(event, (e) => {
            const unvalidatedKinesisEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                eventId: unvalidatedKinesisEvent.raw.eventID,
            })

            return ioValidateFn.before(kinesis.schema.payload, unvalidatedKinesisEvent, 'payload')
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
