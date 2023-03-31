import { firehoseErrorHandler } from './functions/error-handler.js'
import { firehoseParseEvent } from './functions/parse-event.js'
import { firehoseSerializeTransformation } from './functions/serialize-transformation.js'
import type { FirehoseTransformationEvent, FirehoseTransformationHandler, FirehoseTransformationResult } from './types.js'

import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { enumerate, mapTry, transformTry, isSuccess } from '@skyleague/axioms'
import type {
    FirehoseTransformationEventRecord,
    FirehoseTransformationResult as AWSFirehoseTransformationResult,
    FirehoseTransformationResultRecord,
} from 'aws-lambda'

export async function handleFirehoseTransformation(
    handler: FirehoseTransformationHandler,
    events: FirehoseTransformationEventRecord[],
    context: LambdaContext
): Promise<Try<AWSFirehoseTransformationResult>> {
    const { firehose } = handler

    const serializeTransformationFn = firehoseSerializeTransformation()
    const errorHandlerFn = firehoseErrorHandler(context)
    const parseEventFn = firehoseParseEvent(firehose)
    const ioValidateFn = ioValidate<FirehoseTransformationEvent, FirehoseTransformationResult>({ input: (e) => e.payload })
    const ioLoggerFn = ioLogger({ type: 'firehose' }, context)

    const responses: FirehoseTransformationResultRecord[] = []
    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const firehoseEvent = mapTry(event, (e) => {
            const unvalidatedFirehoseEvent = parseEventFn.before(e)
            return ioValidateFn.before(firehose.schema.payload, unvalidatedFirehoseEvent)
        })

        ioLoggerFn.before(firehoseEvent, item)

        const unvalidatedTransformed = await mapTry(firehoseEvent, (success) => firehose.handler(success, context))
        const transformed = mapTry(unvalidatedTransformed, (t) => ioValidateFn.after(firehose.schema.result, t))

        const response = transformTry(
            transformed,
            (x) => serializeTransformationFn.onAfter(event, x),
            (e) => errorHandlerFn.onError(event, e)
        )

        ioLoggerFn.after(undefined, item)

        if (isSuccess(response)) {
            responses.push(response)
        } else {
            return response
        }
    }

    return { records: responses }
}
