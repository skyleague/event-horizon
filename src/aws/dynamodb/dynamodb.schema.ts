import { DynamoDBStreamSchema } from '@aws-lambda-powertools/parser/schemas'

export const dynamoDBStreamSchema = DynamoDBStreamSchema
export const dynamoDBStreamRecord = dynamoDBStreamSchema.shape.Records.element
export const dynamoDBStreamChangeRecord = dynamoDBStreamRecord.shape.dynamodb
export const userIdentity = dynamoDBStreamRecord.shape.userIdentity.unwrap()
