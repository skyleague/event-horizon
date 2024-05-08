import { KinesisDataStreamSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const kinesisDataStreamSchema = $ref(KinesisDataStreamSchema).validator()
export const kinesisDataStreamRecord = kinesisDataStreamSchema.shape.Records.element.validator()
export const kinesisDataStreamRecordPayload = kinesisDataStreamRecord.shape.kinesis
