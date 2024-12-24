import { forAll, tuple } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { SnsNotificationSchema } from '../../../aws/sns/sns.type.js'
import { snsHandler } from '../../../events/sns/sns.js'
import { context } from '../../../test/context/context.js'
import { snsEvent } from './sns.js'

it('should properly validate and type SNS event payload', () => {
    forAll(
        snsEvent(
            snsHandler({
                sns: {
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

            expect(request.raw.Message).toEqual(JSON.stringify(request.payload))
            expect(SnsNotificationSchema.is(request.raw)).toBe(true)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})

it('default parameter types', async () => {
    const handler = snsHandler({
        sns: {
            schema: {},
            handler: (_event, _ctx) => {},
        },
    })
    forAll(tuple(snsEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.sns.handler(request, ctx)).toEqualTypeOf<void>()

        expectTypeOf(request.payload).toEqualTypeOf<unknown>()
    })
})
