import { s3ParseEvent } from './functions/parse-event'
import type { S3Handler } from './types'

import { ioLogger } from '../functions/io-logger'
import type { LambdaContext } from '../types'

import type { Try } from '@skyleague/axioms'
import { enumerate, isFailure, mapTry } from '@skyleague/axioms'
import type { S3EventRecord } from 'aws-lambda'

export async function handleS3Event(handler: S3Handler, events: S3EventRecord[], context: LambdaContext): Promise<Try<void>> {
    const { s3 } = handler
    const parseEventFn = s3ParseEvent()
    const ioLoggerFn = ioLogger({ type: 's3' }, context)

    for (const [i, event] of enumerate(events)) {
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
