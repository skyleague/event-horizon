import type { DynamoDBBatchItemFailure } from 'aws-lambda'
import type { DynamoDBStreamRecord } from '../../../dev/aws/dynamodb/dynamodb.type.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { LambdaContext } from '../../types.js'

export function dynamodbErrorHandler({ logger, isSensitive }: Pick<LambdaContext, 'logger' | 'isSensitive'>) {
    return {
        onError: (original: DynamoDBStreamRecord, error: Error | unknown): DynamoDBBatchItemFailure => {
            if (!isSensitive) {
                EventError.log(logger, error, 'error')
            }

            return { itemIdentifier: original.eventID }
        },
    }
}
