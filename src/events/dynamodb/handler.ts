import type { Try } from '@skyleague/axioms'
import { enumerate, isFailure, mapTry } from '@skyleague/axioms'
import type { DynamoDBStreamRecord } from '../../dev/aws/dynamodb/dynamodb.type.js'
import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import type { LambdaContext } from '../types.js'
import { dynamodbParseEvent } from './functions/parse-event.js'
import type { DynamoDBStreamHandler } from './types.js'

export async function handleDynamoDBStreamEvent<Configuration, Service, Profile>(
    handler: DynamoDBStreamHandler<Configuration, Service, Profile>,
    events: DynamoDBStreamRecord[],
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<void>> {
    const { dynamodb } = handler
    const parseEventFn = dynamodbParseEvent()
    const ioLoggerFn = ioLogger({ type: 'dynamodb' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const dynamodbEvent = mapTry(event, (e) => {
            const unvalidatedDynamodbEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                eventId: unvalidatedDynamodbEvent.raw.eventID,
            })

            return unvalidatedDynamodbEvent
        })

        ioLoggerFn.before(dynamodbEvent, item)

        const response = await mapTry(dynamodbEvent, (success) => dynamodb.handler(success, context))

        ioLoggerFn.after(undefined, item)
        ioLoggerChildFn.after()

        if (isFailure(response)) {
            return response
        }
    }
}
