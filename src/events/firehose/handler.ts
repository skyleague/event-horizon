import type { Try } from '@skyleague/axioms'
import { isSuccess, mapTry, transformTry } from '@skyleague/axioms'
import type {
    FirehoseTransformationResult as AWSFirehoseTransformationResult,
    FirehoseTransformationResultRecord,
} from 'aws-lambda'
import type { KinesisFirehoseRecord } from '../../aws/firehose.js'
import type { MaybeGenericParser } from '../../parsers/types.js'

import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { DefaultServices, LambdaContext } from '../types.js'
import { firehoseErrorHandler } from './functions/error-handler.js'
import { firehoseParseEvent } from './functions/parse-event.js'
import { firehoseSerializeTransformation } from './functions/serialize-transformation.js'
import type { FirehoseTransformationEvent, FirehoseTransformationHandler, FirehoseTransformationResult } from './types.js'

export async function handleFirehoseTransformation<
    const Configuration,
    const Service extends DefaultServices | undefined,
    const Profile extends MaybeGenericParser,
    const Payload extends MaybeGenericParser,
    const Result extends MaybeGenericParser,
>(
    handler: FirehoseTransformationHandler<Configuration, Service, Profile, Payload, Result>,
    events: KinesisFirehoseRecord[],
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<AWSFirehoseTransformationResult>> {
    const { firehose } = handler

    const serializeTransformationFn = firehoseSerializeTransformation()
    const errorHandlerFn = firehoseErrorHandler(context)
    const parseEventFn = firehoseParseEvent(firehose)
    const ioValidateFn = ioValidate<FirehoseTransformationEvent, FirehoseTransformationResult>()
    const ioLoggerFn = ioLogger({ type: 'firehose' }, context)

    const responses: FirehoseTransformationResultRecord[] = []
    for (const [i, event] of events.entries()) {
        const item = { item: i }

        const firehoseEvent = await mapTry(event, (e) => {
            const unvalidatedFirehoseEvent = parseEventFn.before(e)
            return ioValidateFn.before(firehose.schema.payload, unvalidatedFirehoseEvent, 'payload')
        })

        ioLoggerFn.before(firehoseEvent, item)

        const unvalidatedTransformed = await mapTry(firehoseEvent, (success) => firehose.handler(success, context))
        const transformed = await mapTry(unvalidatedTransformed, (t) => ioValidateFn.after(firehose.schema.result, t, 'payload'))

        const response = transformTry(
            transformed,
            (x) => serializeTransformationFn.onAfter(event, x),
            (e) => errorHandlerFn.onError(event, e),
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
