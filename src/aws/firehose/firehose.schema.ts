import { KinesisFirehoseSchema } from '@aws-lambda-powertools/parser/schemas'

export const kinesisFirehoseSchema = KinesisFirehoseSchema
export const kinesisFirehoseRecord = kinesisFirehoseSchema.shape.records.element
export const kinesisRecordMetadata = kinesisFirehoseRecord.shape.kinesisRecordMetadata.unwrap()
