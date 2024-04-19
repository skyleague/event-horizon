import type { SQSRecord } from './sqs.type.js'

import type { SQSRecord as LambdaSqsRecord } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    const _test: SQSRecord = {} as unknown as LambdaSqsRecord
    // const _test2: LambdaSqsRecord = {} as unknown as SQSRecord
})
