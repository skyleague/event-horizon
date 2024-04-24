import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { S3EventRecord } from 'aws-lambda'

export interface S3Event {
    raw: S3EventRecord
}

export interface S3EventHandler<Configuration = unknown, Service = unknown, Profile = unknown> {
    handler: (
        request: NoInfer<S3Event>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<void>>>
}

export interface S3Handler<Configuration = unknown, Service = unknown, Profile = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    s3: S3EventHandler<Configuration, Service, Profile>
}
