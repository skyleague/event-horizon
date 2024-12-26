import { KinesisDataStreamRecord } from '@aws-lambda-powertools/parser/schemas'
import { forAll, tuple } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { kinesisHandler } from '../../../events/kinesis/kinesis.js'
import { context } from '../../../test/context/context.js'
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
            KinesisDataStreamRecord.parse(request.raw)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})

it('default parameter types', async () => {
    const handler = kinesisHandler({
        kinesis: {
            schema: {},
            handler: (_event, _ctx) => {},
        },
    })
    forAll(tuple(kinesisEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.kinesis.handler(request, ctx)).toEqualTypeOf<void>()

        expectTypeOf(request.payload).toEqualTypeOf<unknown>()
    })
})
