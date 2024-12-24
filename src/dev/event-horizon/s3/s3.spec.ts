import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf } from 'vitest'
import { it } from 'vitest'
import { z } from 'zod'
import { S3RecordSchema } from '../../../aws/s3/s3.type.js'
import { s3Handler } from '../../../events/s3/s3.js'
import type { S3Event } from '../../../events/s3/types.js'
import { s3Event } from './s3.js'

it('should properly validate and type S3 event payload', () => {
    forAll(
        s3Event(
            s3Handler({
                s3: {
                    schema: {
                        result: z.literal('result'),
                    },
                    handler: (event) => {
                        expectTypeOf(event).toEqualTypeOf<S3Event>()
                    },
                },
            }),
        ),
        (request) => {
            expect(request.raw).toBeDefined()
            expect(S3RecordSchema.is(request.raw)).toBe(true)
        },
    )
})
