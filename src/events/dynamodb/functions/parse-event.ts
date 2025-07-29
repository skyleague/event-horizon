import type { DynamoDBStreamRecord } from '../../../aws/dynamodb.js'
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
