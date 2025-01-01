import { SqsSchema } from '@aws-lambda-powertools/parser/schemas'

export const sqsSchema = SqsSchema
export const sqsRecordSchema = SqsSchema.shape.Records.element
export const sqsAttributesSchema = sqsRecordSchema.shape.attributes
export const sqsMsgAttributeSchema = sqsRecordSchema.shape.messageAttributes.element
