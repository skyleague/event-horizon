import type { Try } from '@skyleague/axioms'
import type { Promisable } from '@skyleague/axioms/types'
import type { DynamoDBStreamRecord } from '../../aws/dynamodb.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface DynamoDBStreamEvent {
    readonly raw: DynamoDBStreamRecord
}

export interface DynamoDBStreamEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = undefined,
> {
    schema?: never
    handler: (
        request: NoInfer<DynamoDBStreamEvent>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<void>>
}

export interface DynamoDBStreamHandler<Configuration = unknown, Service = unknown, Profile extends MaybeGenericParser = undefined>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    dynamodb: DynamoDBStreamEventHandler<Configuration, Service, Profile>
}
