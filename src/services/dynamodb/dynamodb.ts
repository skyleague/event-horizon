import { tracer } from '../../observability/tracer/tracer'

import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createDynamoDB = memoize<DynamoDB>(() => tracer.captureAWSv3Client(new DynamoDB({})))

/**
 * @group Services
 */
export const createDocumentClient = memoize<DynamoDBDocumentClient>(() => {
    const db = DynamoDBDocumentClient.from(createDynamoDB())
    if ('service' in db) {
        tracer.captureAWSv3Client((db as { service?: DynamoDB }).service)
    }
    return db
})
