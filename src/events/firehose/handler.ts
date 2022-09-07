import type { FirehoseTransformationEvent, FirehoseTransformationHandler } from './types'

import { EventError } from '../../errors/event-error'
import { firehoseErrorHandler } from '../../functions/firehose/error-handler'
import { firehoseParseEvent } from '../../functions/firehose/parse-event'
import { firehoseSerializeTransformation } from '../../functions/firehose/serialize-transformation'
import { ioLogger } from '../../functions/shared/io-logger'
import { ioValidate } from '../../functions/shared/io-validate'
import type { LambdaContext } from '../types'

import { enumerate } from '@skyleague/axioms'
import type {
    FirehoseTransformationEventRecord,
    FirehoseTransformationResult,
    FirehoseTransformationResultRecord,
} from 'aws-lambda'

export async function handleFirehoseTransformation(
    handler: FirehoseTransformationHandler,
    events: FirehoseTransformationEventRecord[],
    context: LambdaContext
): Promise<FirehoseTransformationResult> {
    const { firehose } = handler

    const errorHandlerFn = firehoseErrorHandler(context)
    const serializeTransformationFn = firehoseSerializeTransformation()
    const parseEventFn = firehoseParseEvent(firehose)
    const ioValidateFn = ioValidate<FirehoseTransformationEvent>({ input: (e) => e.payload })
    const ioLoggerFn = ioLogger({ type: 'firehose' }, context)

    const responses: FirehoseTransformationResultRecord[] = []
    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        let response: FirehoseTransformationResultRecord
        try {
            const unvalidatedFirehoseEvent = parseEventFn.before(event)
            const firehoseEvent = ioValidateFn.before(firehose.schema.payload, unvalidatedFirehoseEvent)

            if ('left' in firehoseEvent) {
                throw EventError.badRequest(firehoseEvent.left[0].message)
            }
            ioLoggerFn.before(firehoseEvent, item)

            const transformed = await firehose.handler(firehoseEvent.right, context)

            response = serializeTransformationFn.onAfter(event, transformed)
        } catch (e: unknown) {
            response = errorHandlerFn.onError(event, e)
        }
        ioLoggerFn.after(undefined, item)

        responses.push(response)
    }

    return { records: responses }
}
