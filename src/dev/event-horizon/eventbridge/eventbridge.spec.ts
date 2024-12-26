import { EventBridgeSchema } from '@aws-lambda-powertools/parser/schemas'
import { forAll, tuple } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { eventBridgeHandler } from '../../../events/eventbridge/eventbridge.js'
import { context } from '../../../test/context/context.js'
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
            EventBridgeSchema.parse(request.raw)

            expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
        },
    )
})

it('default parameter types', async () => {
    const handler = eventBridgeHandler({
        eventBridge: {
            schema: {},
            handler: (_event, _ctx) => {},
        },
    })
    forAll(tuple(eventBridgeEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.eventBridge.handler(request, ctx)).toEqualTypeOf<void>()

        expectTypeOf(request.payload).toEqualTypeOf<unknown>()
    })
})

it('default parameter return types', async () => {
    const handler = eventBridgeHandler({
        eventBridge: {
            schema: {},
            handler: (_event, _ctx) => {
                return 'result' as const
            },
        },
    })
    forAll(tuple(eventBridgeEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.eventBridge.handler(request, ctx)).toEqualTypeOf<'result'>()

        expectTypeOf(request.payload).toEqualTypeOf<unknown>()
    })
})
