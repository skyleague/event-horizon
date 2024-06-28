import type { SQSRecord } from 'aws-lambda'
import type { SQSEvent } from 'aws-lambda/trigger/sqs.js'
import { it } from 'vitest'
import type { SqsRecordSchema, SqsSchema } from './sqs.type.js'

it('type is compatible', () => {
    // @ts-expect-error
    const _test_schema: SqsSchema = {} as unknown as SQSEvent

    // @ts-expect-error
    const _test: SqsRecordSchema = {} as unknown as SQSRecord
    // @ts-expect-error
    const _test2: SQSRecord = {} as unknown as SqsRecordSchema
})
