import {
    APIGatewayProxyEventSchema,
    APIGatewayProxyEventV2Schema,
    APIGatewayRequestAuthorizerEventSchema,
    APIGatewayRequestAuthorizerEventV2Schema,
    EventBridgeSchema as AWSEventBridgeSchema,
    KinesisDataStreamSchema,
    KinesisFirehoseSchema,
    S3Schema,
    SnsSchema,
    SqsSchema,
} from '@aws-lambda-powertools/parser/schemas'
import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import type { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { eventBridgeHandler } from './eventbridge.js'
import type { EventBridgeEvent } from './types.js'

it('handles eventbridge events', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { _kernel: eventBridge },
    )
    await asyncForAll(tuple(arbitrary(AWSEventBridgeSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        eventBridge.mockClear()
        eventBridge.mockReturnValue(ret)

        const response = await handler._options.handler(event as EventBridgeSchema, ctx)
        expect(response).toBe(ret)
        expect(eventBridge).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('handles schema types', () => {
    const handler = eventBridgeHandler({
        eventBridge: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<EventBridgeEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<EventBridgeSchema>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<(request: EventBridgeEvent<'payload'>) => 'result'>()
})

it('handles schema types - zod', () => {
    const handler = eventBridgeHandler({
        eventBridge: {
            schema: { payload: z.literal('payload'), result: z.literal('result') },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<EventBridgeEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<EventBridgeSchema>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<(request: EventBridgeEvent<'payload'>) => 'result'>()
})

it('handles schema types - default', () => {
    const handler = eventBridgeHandler({
        eventBridge: {
            schema: {},
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<EventBridgeEvent<unknown>>()
                expectTypeOf(request.payload).toEqualTypeOf<unknown>()
                expectTypeOf(request.raw).toEqualTypeOf<EventBridgeSchema>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<(request: EventBridgeEvent<unknown>) => 'result'>()
})

it('handles service and config types', () => {
    {
        const handler = eventBridgeHandler({
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<undefined, undefined, undefined>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            config: 'config' as const,
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            config: () => 'config' as const,
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            services: { services: 'services' as const },
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            services: () => ({ services: 'services' as const }),
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<'config', { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            profile: { schema: literalSchema<'profile'>() },
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => void
        >()
    }
    {
        const handler = eventBridgeHandler({
            profile: { schema: z.literal('profile') },
            eventBridge: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<
            (request: EventBridgeEvent<unknown>, context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>) => void
        >()
    }
})

it('handles schema types and gives errors', () => {
    eventBridgeHandler({
        eventBridge: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return 'not-result' as const
            },
        },
    })
})

it('does not handle non eventbridge events', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { _kernel: eventBridge },
    )
    await asyncForAll(
        tuple(
            oneOf(
                // arbitrary(EventBridgeEvent),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(APIGatewayRequestAuthorizerEventSchema),
                arbitrary(APIGatewayRequestAuthorizerEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(s3BatchEvent),
                arbitrary(secretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            eventBridge.mockClear()
            eventBridge.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { _kernel: eventBridge },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(eventBridge).not.toHaveBeenCalled()
})
