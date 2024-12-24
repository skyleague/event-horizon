import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { EventBridgeSchema } from '../../../aws/eventbridge/eventbridge.type.js'
import { eventBridgeHandler } from '../../../events/eventbridge/eventbridge.js'
import { eventBridgeEvent } from './eventbridge.js'

it('should properly validate and type eventbridge event payload', () => {
    forAll(
        eventBridgeEvent(
            eventBridgeHandler({
                eventBridge: {
                    schema: {
                        payload: z.literal('payload'),
                        result: z.literal('result'),
                    },
                    handler: ({ payload }) => {
                        expectTypeOf(payload).toEqualTypeOf<'payload'>()

                        return 'result' as const
                    },
                },
            }),
        ),
        (request) => {
            expect(request.payload).toEqual('payload')

            expect(request.raw.detail).toEqual(request.payload)
            expect(EventBridgeSchema.is(request.raw)).toBe(true)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})
