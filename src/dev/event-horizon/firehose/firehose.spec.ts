import { forAll, tuple } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { kinesisFirehoseRecord } from '../../../aws/firehose/firehose.schema.js'
import { firehoseHandler } from '../../../events/firehose/firehose.js'
import { context } from '../../../test/context/context.js'
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
            kinesisFirehoseRecord.parse(request.raw)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})

it('default parameter types', async () => {
    const handler = firehoseHandler({
        firehose: {
            schema: {},
            handler: (_event, _ctx) => {
                return {
                    status: 'Ok',
                    payload: 'result' as const,
                }
            },
        },
    })
    forAll(tuple(firehoseTransformationEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.firehose.handler(request, ctx)).toEqualTypeOf<{
            status: 'Ok'
            payload: 'result'
        }>()

        expectTypeOf(request.payload).toEqualTypeOf<unknown>()
    })
})

it('default parameter return types', async () => {
    const handler = firehoseHandler({
        firehose: {
            schema: {},
            handler: (_event, _ctx) => {
                return {
                    status: 'Ok',
                    payload: 'result' as const,
                }
            },
        },
    })
    forAll(tuple(firehoseTransformationEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.firehose.handler(request, ctx)).toEqualTypeOf<{
            status: 'Ok'
            payload: 'result'
        }>()

        expectTypeOf(request.payload).toEqualTypeOf<unknown>()
    })
})
