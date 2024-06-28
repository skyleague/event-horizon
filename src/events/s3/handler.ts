import type { Try } from '@skyleague/axioms'
import { isFailure, mapTry } from '@skyleague/axioms'
import type { S3RecordSchema } from '../../aws/s3/s3.type.js'
import { ioLogger } from '../functions/io-logger.js'
import type { LambdaContext } from '../types.js'
import { s3ParseEvent } from './functions/parse-event.js'
import type { S3Handler } from './types.js'

export async function handleS3Event<Configuration, Service, Profile>(
    handler: S3Handler<Configuration, Service, Profile>,
    events: S3RecordSchema[],
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<void>> {
    const { s3 } = handler
    const parseEventFn = s3ParseEvent()
    const ioLoggerFn = ioLogger({ type: 's3' }, context)

    for (const [i, event] of events.entries()) {
        const item = { item: i }

        const s3Event = parseEventFn.before(event)

        ioLoggerFn.before(s3Event, item)

        const response = await mapTry(s3Event, (e) => s3.handler(e, context))

        ioLoggerFn.after(undefined, item)

        if (isFailure(response)) {
            return response
        }
    }
}
