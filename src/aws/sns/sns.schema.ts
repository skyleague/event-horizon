import { SnsSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const snsSchema = $ref(SnsSchema).validator()
export const snsRecordSchema = snsSchema.shape.Records.element.validator()
export const snsNotificationSchema = snsRecordSchema.shape.Sns.validator()
export const snsMsgAttribute = snsNotificationSchema.shape.MessageAttributes.unwrap().element
