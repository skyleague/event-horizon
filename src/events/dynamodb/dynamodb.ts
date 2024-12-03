import type { DynamoDBStreamRecord } from '../../aws/dynamodb/dynamodb.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleDynamoDBStreamEvent } from './handler.js'
import type { DynamoDBStreamHandler } from './types.js'

export function dynamodbHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
>(
    definition: D & DynamoDBStreamHandler<Configuration, Service, Profile>,
    { _kernel = handleDynamoDBStreamEvent }: { _kernel?: typeof handleDynamoDBStreamEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: DynamoDBStreamRecord[] = []
                const other: unknown[] = []
                for (const record of request.Records) {
                    if ('dynamodb' in record) {
                        records.push(record)
                    } else {
                        other.push(record)
                    }
                }
                if (other.length > 0) {
                    throw EventError.unexpectedEventType()
                }
                return _kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile>
}
