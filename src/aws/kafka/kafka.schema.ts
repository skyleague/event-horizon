import { KafkaMskEventSchema, KafkaSelfManagedEventSchema } from '@aws-lambda-powertools/parser/schemas'

export const kafkaMskEventSchema = KafkaMskEventSchema
export const kafkaSelfManagedEventSchema = KafkaSelfManagedEventSchema
export const kafkaRecordSchema = kafkaMskEventSchema.shape.records.element.element
