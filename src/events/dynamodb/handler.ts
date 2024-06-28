import type { Try } from '@skyleague/axioms'
import { isLeft, mapLeft, mapTry, tryToEither } from '@skyleague/axioms'
import type { DynamoDBBatchItemFailure, DynamoDBBatchResponse } from 'aws-lambda/trigger/dynamodb-stream.js'
import type { DynamoDBStreamRecord } from '../../dev/aws/dynamodb/dynamodb.type.js'
import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import type { LambdaContext } from '../types.js'
import { dynamodbErrorHandler } from './functions/error-handler.js'
import { dynamodbParseEvent } from './functions/parse-event.js'
import type { DynamoDBStreamHandler } from './types.js'

export async function handleDynamoDBStreamEvent<Configuration, Service, Profile>(
    handler: DynamoDBStreamHandler<Configuration, Service, Profile>,
    events: DynamoDBStreamRecord[],
    context: LambdaContext<Configuration, Service, Profile>,
    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
): Promise<Try<DynamoDBBatchResponse | void>> {
    const { dynamodb } = handler
    const errorHandlerFn = dynamodbErrorHandler(context)
    const parseEventFn = dynamodbParseEvent()
    const ioLoggerFn = ioLogger({ type: 'dynamodb' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    let failures: DynamoDBBatchItemFailure[] | undefined = undefined

    for (const [i, event] of events.entries()) {
        const item = { item: i }

        const dynamodbEvent = mapTry(event, (e) => {
            const unvalidatedDynamodbEvent = parseEventFn.before(e)

            ioLoggerChildFn.before({
                eventId: unvalidatedDynamodbEvent.raw.eventID,
            })

            return unvalidatedDynamodbEvent
        })

        ioLoggerFn.before(dynamodbEvent, item)

        const transformed = await mapTry(dynamodbEvent, (success) => dynamodb.handler(success, context))

        const eitherTransformed = tryToEither(transformed)
        const response = mapLeft(eitherTransformed, (e) => errorHandlerFn.onError(event, e))

        ioLoggerFn.after(undefined, item)
        ioLoggerChildFn.after()

        if (isLeft(response)) {
            failures ??= []
            failures.push(response.left)
        }
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
}
