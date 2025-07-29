import type { SnsSchema as AwsSnsSchema } from '@aws-lambda-powertools/parser/schemas'
import type z from 'zod'

export type SnsSchema = z.infer<typeof AwsSnsSchema>
export type SnsRecordSchema = SnsSchema['Records'][number]
export type SnsNotificationSchema = SnsRecordSchema['Sns']
