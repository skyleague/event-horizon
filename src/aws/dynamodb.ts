import type { DynamoDBStreamSchema as AwsDynamoDBStreamSchema } from '@aws-lambda-powertools/parser/schemas'
import type z from 'zod'

export type DynamoDBStreamSchema = z.infer<typeof AwsDynamoDBStreamSchema>
export type DynamoDBStreamRecord = DynamoDBStreamSchema['Records'][number]
