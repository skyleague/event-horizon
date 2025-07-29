import type {
    KinesisFirehoseRecordSchema as AwsKinesisFirehoseRecord,
    KinesisFirehoseSchema as AwsKinesisFirehoseSchema,
} from '@aws-lambda-powertools/parser/schemas'
import type z from 'zod'

export type KinesisFirehoseSchema = z.infer<typeof AwsKinesisFirehoseSchema>
export type KinesisFirehoseRecord = z.infer<typeof AwsKinesisFirehoseRecord>
