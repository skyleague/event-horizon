import { SnsSchema } from '@aws-lambda-powertools/parser/schemas'

export const snsSchema = SnsSchema
export const snsRecordSchema = snsSchema.shape.Records.element
export const snsNotificationSchema = snsRecordSchema.shape.Sns
export const snsMsgAttribute = snsNotificationSchema.shape.MessageAttributes.unwrap().element
