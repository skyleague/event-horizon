import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { KinesisDataStreamRecord } from '../../../aws/kinesis/kinesis.type.js'
import { kinesisHandler } from '../../../events/kinesis/kinesis.js'
import { kinesisEvent } from './kinesis.js'

it('should properly validate and type SNS event payload', () => {
    forAll(
        kinesisEvent(
            kinesisHandler({
                kinesis: {
                    schema: {
                        payload: z.literal('payload'),
                    },
                    handler: ({ payload }) => {
                        expectTypeOf(payload).toEqualTypeOf<'payload'>()
                    },
                },
            }),
        ),
        (request) => {
            expect(request.payload).toEqual('payload')

            expect(request.raw.kinesis.data).toEqual(JSON.stringify(request.payload))
            expect(KinesisDataStreamRecord.is(request.raw)).toBe(true)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})
