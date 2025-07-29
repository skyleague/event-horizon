import type { SqsRecordSchema as AwsSqsRecordSchema, SqsSchema as AwsSqsSchema } from '@aws-lambda-powertools/parser/schemas'
import type { z } from 'zod'

export type SqsSchema = z.infer<typeof AwsSqsSchema>
export type SqsRecordSchema = z.infer<typeof AwsSqsRecordSchema>
