import { CloudWatchLogEventSchema, CloudWatchLogsDecodeSchema, CloudWatchLogsSchema } from '@aws-lambda-powertools/parser/schemas'
import { $ref } from '@skyleague/therefore'

export const cloudWatchLogsSchema = $ref(CloudWatchLogsSchema).validator()
export const cloudWatchLogsDecodeSchema = $ref(CloudWatchLogsDecodeSchema)
export const cloudWatchLogEventSchema = $ref(CloudWatchLogEventSchema)
