import type { Promisable, Try } from '@skyleague/axioms'
import type { S3BatchEvent, S3BatchEventTask, S3BatchResultResultCode } from 'aws-lambda'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface S3BatchTaskResult<Result = unknown> {
    status: S3BatchResultResultCode
    payload: Result
}

export interface S3BatchTask {
    taskId: string
    s3Key: string
    s3VersionId: string | undefined
    s3BucketArn: string
    readonly raw: { task: S3BatchEventTask; job: Omit<S3BatchEvent, 'tasks'> }
}

export interface S3BatchEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> {
    schema: {
        result?: Result
    }
    handler: (
        request: NoInfer<S3BatchTask>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<S3BatchTaskResult<InferFromParser<Result, unknown>>>>>
    treatMissingKeysAs?: S3BatchResultResultCode
    treatErrorsAs?: S3BatchResultResultCode
}

export interface S3BatchHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Result extends MaybeGenericParser = MaybeGenericParser,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    s3Batch: S3BatchEventHandler<Configuration, Service, Profile, Result>
}
