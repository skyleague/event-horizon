import type { Promisable, Try } from '@skyleague/axioms'
import type { DynamoDBStreamRecord } from '../../dev/aws/dynamodb/dynamodb.type.js'
import type { EventHandlerDefinition, LambdaContext } from '../types.js'

export interface DynamoDBStreamEvent {
    readonly raw: DynamoDBStreamRecord
}

export interface DynamoDBStreamEventHandler<Configuration = unknown, Service = unknown, Profile = unknown> {
    schema?: never
    handler: (
        request: NoInfer<DynamoDBStreamEvent>,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<NoInfer<void>>>
}

export interface DynamoDBStreamHandler<Configuration = unknown, Service = unknown, Profile = unknown>
    extends EventHandlerDefinition<Configuration, Service, Profile> {
    dynamodb: DynamoDBStreamEventHandler<Configuration, Service, Profile>
}
