import { KinesisDataStreamSchema } from '@aws-lambda-powertools/parser/schemas'

export const kinesisDataStreamSchema = KinesisDataStreamSchema
export const kinesisDataStreamRecord = kinesisDataStreamSchema.shape.Records.element
export const kinesisDataStreamRecordPayload = kinesisDataStreamRecord.shape.kinesis
