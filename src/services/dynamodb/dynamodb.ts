import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import DynamoDB, { DocumentClient } from 'aws-sdk/clients/dynamodb'

export const createDynamoDB = memoize<DynamoDB>(() => tracer.captureAWSClient(new DynamoDB()))
export const createDocumentClient = memoize<DocumentClient>(() => {
    const db = new DocumentClient({ service: createDynamoDB() })
    if ('service' in db) {
        tracer.captureAWSClient((db as { service?: DynamoDB }).service)
    }
    return db
})
