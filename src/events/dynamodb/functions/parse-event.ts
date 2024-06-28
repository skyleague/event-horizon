import type { DynamoDBStreamRecord } from '../../../aws/dynamodb/dynamodb.type.js'
import type { DynamoDBStreamEvent } from '../types.js'

export function dynamodbParseEvent() {
    return {
        before: (event: DynamoDBStreamRecord): DynamoDBStreamEvent => {
            return {
                raw: event,
            }
        },
    }
}
