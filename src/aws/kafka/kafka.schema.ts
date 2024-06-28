import { KafkaMskEventSchema, KafkaSelfManagedEventSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const kafkaMskEventSchema = $ref(KafkaMskEventSchema).validator()
export const kafkaSelfManagedEventSchema = $ref(KafkaSelfManagedEventSchema).validator()
export const kafkaRecordSchema = kafkaMskEventSchema.shape.records.element.element.validator()
