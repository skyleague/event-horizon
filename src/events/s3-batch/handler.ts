import { s3BatchErrorHandler } from './functions/error-handler.js'
import { s3BatchParseEvent } from './functions/parse-event.js'
import { s3BatchSerializeResult } from './functions/serialize-result.js'
import type { S3BatchHandler, S3BatchTaskResult } from './types.js'

import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { enumerate, mapTry, transformTry, isSuccess } from '@skyleague/axioms'
import type { S3BatchEvent, S3BatchResult, S3BatchResultResult } from 'aws-lambda'

export async function handleS3Batch<Configuration, Service, Profile, Result>(
    handler: S3BatchHandler<Configuration, Service, Profile, Result>,
    event: S3BatchEvent,
    context: LambdaContext<Configuration, Service, Profile>
): Promise<Try<S3BatchResult>> {
    const { s3Batch } = handler

    const errorHandlerFn = s3BatchErrorHandler(handler, context)
    const serializeResult = s3BatchSerializeResult<Result>()
    const parseEventFn = s3BatchParseEvent()
    const ioValidateFn = ioValidate<never, S3BatchTaskResult>()
    const ioLoggerFn = ioLogger({ type: 's3-batch' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    const results: S3BatchResultResult[] = []
    for (const [i, task] of enumerate(event.tasks)) {
        const item = { item: i }

        const s3BatchTask = parseEventFn.before(event, task)

        ioLoggerChildFn.before({
            taskId: s3BatchTask.taskId,
            s3Key: s3BatchTask.s3Key,
            s3VersionId: s3BatchTask.s3VersionId,
            s3BucketArn: s3BatchTask.s3BucketArn,
        })
        ioLoggerFn.before(s3BatchTask, item)

        const unvalidatedResponse = await mapTry(s3BatchTask, (t) => s3Batch.handler(t, context))
        const response = mapTry(unvalidatedResponse, (v) => ioValidateFn.after(s3Batch.schema.result, v, 'payload'))

        const result = transformTry(
            response,
            (x) => serializeResult.onAfter(task, x),
            (e) => errorHandlerFn.onError(task, e)
        )

        ioLoggerFn.after(result, item)
        ioLoggerChildFn.after()

        if (isSuccess(result)) {
            results.push(result)
        } else {
            return result
        }
    }

    return {
        invocationSchemaVersion: event.invocationSchemaVersion,
        invocationId: event.invocationId,
        treatMissingKeysAs: handler.s3Batch.treatMissingKeysAs ?? 'TemporaryFailure',
        results,
    }
}
