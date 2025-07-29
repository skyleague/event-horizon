import type { S3Schema as AwsS3Schema } from '@aws-lambda-powertools/parser/schemas'
import type z from 'zod'

export type S3Schema = z.infer<typeof AwsS3Schema>
export type S3RecordSchema = S3Schema['Records'][number]
