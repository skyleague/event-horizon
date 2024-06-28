import { DynamoDBStreamSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const dynamoDBStreamSchema = $ref(DynamoDBStreamSchema).validator()
export const dynamoDBStreamRecord = dynamoDBStreamSchema.shape.Records.element.validator()
export const dynamoDBStreamChangeRecord = dynamoDBStreamRecord.shape.dynamodb
export const userIdentity = dynamoDBStreamRecord.shape.userIdentity.unwrap()
