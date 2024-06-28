import type { SnsSchema } from './sns.type.js'

import type { SNSEvent } from 'aws-lambda'
import { it } from 'vitest'

it('type is compatible', () => {
    // @ts-expect-error
    const _test: SnsSchema = {} as unknown as SNSEvent
    // @ts-expect-error
    const _test2: SNSEvent = {} as unknown as SnsSchema
})
