import { KinesisFirehoseSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const kinesisFirehoseSchema = $ref(KinesisFirehoseSchema).validator()
export const kinesisFirehoseRecord = kinesisFirehoseSchema.shape.records.element.validator()
export const kinesisRecordMetaData = kinesisFirehoseRecord.shape.kinesisRecordMetaData.unwrap()
