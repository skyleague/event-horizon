import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Schema } from '@skyleague/therefore'
import type { S3BatchEvent, S3BatchResultResultCode, S3BatchEventTask } from 'aws-lambda'

export interface S3BatchTaskResult<R = unknown> {
    status: S3BatchResultResultCode
    payload: R
}

export interface S3BatchTask {
    taskId: string
    s3Key: string
    s3VersionId: string | undefined
    s3BucketArn: string
    raw: { task: S3BatchEventTask; job: Omit<S3BatchEvent, 'tasks'> }
}

export interface S3BatchEventHandler<C = never, S = never, R = unknown> {
    schema: {
        result?: Schema<R>
    }
    handler: (request: S3BatchTask, context: LambdaContext<C, S>) => Promise<S3BatchTaskResult<R>> | S3BatchTaskResult<R>
    treatMissingKeysAs?: S3BatchResultResultCode
    treatErrorsAs?: S3BatchResultResultCode
}

export interface S3BatchHandler<C = never, S = never, R = unknown> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    s3Batch: S3BatchEventHandler<C, S, R>
}
