import type { LambdaContext, EventHandlerDefinition } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { S3EventRecord } from 'aws-lambda'

export interface S3Event {
    raw: S3EventRecord
}

export interface S3EventHandler<Configuration = never, Service = never, Profile = never> {
    handler: (request: S3Event, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
}

export interface S3Handler<Configuration = never, Service = never, Profile = never>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    s3: S3EventHandler<Configuration, Service, Profile>
}
