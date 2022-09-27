import { s3BatchErrorHandler } from './functions/error-handler'
import { s3BatchParseEvent } from './functions/parse-event'
import { s3BatchSerializeResult } from './functions/serialize-result'
import type { S3BatchHandler, S3BatchTaskResult } from './types'

import { EventError } from '../../errors/event-error'
import { ioLogger } from '../functions/io-logger'
import { ioValidate } from '../functions/io-validate'
import type { LambdaContext } from '../types'

import { enumerate } from '@skyleague/axioms'
import type { S3BatchEvent, S3BatchResult, S3BatchResultResult } from 'aws-lambda'
export async function handleS3Batch(
    handler: S3BatchHandler,
    event: S3BatchEvent,
    context: LambdaContext
): Promise<S3BatchResult> {
    const { s3Batch } = handler

    const errorHandlerFn = s3BatchErrorHandler(handler, context)
    const serializeResult = s3BatchSerializeResult()
    const parseEventFn = s3BatchParseEvent()
    const ioValidateFn = ioValidate<never, S3BatchTaskResult>({ output: (e) => e.payload })
    const ioLoggerFn = ioLogger({ type: 's3-batch' }, context)

    const results: S3BatchResultResult[] = []
    for (const [i, task] of enumerate(event.tasks)) {
        const item = { item: i }

        let result: S3BatchResultResult
        try {
            const s3BatchTask = parseEventFn.before(event, task)
            ioLoggerFn.before(s3BatchTask, item)

            const unvalidatedResponse = await s3Batch.handler(s3BatchTask, context)

            const response = ioValidateFn.after(s3Batch.schema.result, unvalidatedResponse)
            if ('left' in response) {
                throw EventError.badRequest(response.left[0].message)
            }

            result = serializeResult.onAfter(task, response.right)
        } catch (e: unknown) {
            result = errorHandlerFn.onError(task, e)
        }
        ioLoggerFn.after(result, item)

        results.push(result)
    }

    return {
        invocationSchemaVersion: event.invocationSchemaVersion,
        invocationId: event.invocationId,
        treatMissingKeysAs: handler.s3Batch.treatMissingKeysAs ?? 'TemporaryFailure',
        results,
    }
}
