import { SqsSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const sqsSchema = $ref(SqsSchema).validator()
export const sqsRecordSchema = $ref(SqsSchema.shape.Records.element).validator()
export const sqsAttributesSchema = sqsRecordSchema.shape.attributes
export const sqsMsgAttributeSchema = sqsRecordSchema.shape.messageAttributes.element
