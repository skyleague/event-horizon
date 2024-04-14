import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { S3BatchEvent, S3BatchEventTask, S3BatchResultResultCode } from 'aws-lambda'

export interface S3BatchTaskResult<Result = unknown> {
    status: S3BatchResultResultCode
    payload: Result
}

export interface S3BatchTask {
    taskId: string
    s3Key: string
    s3VersionId: string | undefined
    s3BucketArn: string
    raw: { task: S3BatchEventTask; job: Omit<S3BatchEvent, 'tasks'> }
}

export interface S3BatchEventHandler<Configuration = unknown, Service = unknown, Profile = unknown, Result = unknown> {
    schema: {
        result?: Schema<Result>
    }
    handler: NoInfer<
        (
            request: S3BatchTask,
            context: LambdaContext<Configuration, Service, Profile>,
        ) => Promisable<Try<S3BatchTaskResult<Result>>>
    >
    treatMissingKeysAs?: S3BatchResultResultCode
    treatErrorsAs?: S3BatchResultResultCode
}

export interface S3BatchHandler<Configuration = unknown, Service = unknown, Profile = unknown, Result = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    s3Batch: S3BatchEventHandler<Configuration, Service, Profile, Result>
}
