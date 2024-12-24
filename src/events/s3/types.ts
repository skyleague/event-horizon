import type { Promisable, Try } from '@skyleague/axioms'
import type { S3RecordSchema } from '../../aws/s3/s3.type.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface S3Event {
    readonly raw: S3RecordSchema
}

export interface S3EventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
> {
    handler: (request: S3Event, context: LambdaContext<Configuration, Service, Profile>) => Promisable<Try<void>>
}

export interface S3Handler<Configuration = unknown, Service = unknown, Profile extends MaybeGenericParser = MaybeGenericParser>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    s3: S3EventHandler<Configuration, Service, Profile>
}
