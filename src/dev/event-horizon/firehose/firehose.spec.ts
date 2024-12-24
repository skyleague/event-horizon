import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { KinesisFirehoseRecord } from '../../../aws/firehose/firehose.type.js'
import { firehoseHandler } from '../../../events/firehose/firehose.js'
import { firehoseTransformationEvent } from './firehose.js'

it('should properly validate and type firehose event payload', () => {
    forAll(
        firehoseTransformationEvent(
            firehoseHandler({
                firehose: {
                    schema: {
                        payload: z.literal('payload'),
                        result: z.literal('result'),
                    },
                    handler: ({ payload }) => {
                        expectTypeOf(payload).toEqualTypeOf<'payload'>()

                        return {
                            status: 'Ok',
                            payload: 'result' as const,
                        }
                    },
                },
            }),
        ),
        (request) => {
            expect(request.payload).toEqual('payload')

            expect(request.raw.data).toEqual(JSON.stringify(request.payload))
            expect(KinesisFirehoseRecord.is(request.raw)).toBe(true)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})
