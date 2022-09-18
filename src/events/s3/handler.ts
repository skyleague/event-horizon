import type { S3Handler } from './types'

import { s3ParseEvent } from '../../functions/s3/parse-event'
import { ioLogger } from '../../functions/shared/io-logger'
import type { LambdaContext } from '../types'

import { enumerate } from '@skyleague/axioms'
import type { S3EventRecord } from 'aws-lambda'

export async function handleS3Event(handler: S3Handler, events: S3EventRecord[], context: LambdaContext): Promise<void> {
    const { s3 } = handler
    const parseEventFn = s3ParseEvent()
    const ioLoggerFn = ioLogger({ type: 's3' }, context)

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const s3Event = parseEventFn.before(event)

        ioLoggerFn.before(s3Event, item)

        await s3.handler(s3Event, context)

        ioLoggerFn.after(undefined, item)
    }
}
