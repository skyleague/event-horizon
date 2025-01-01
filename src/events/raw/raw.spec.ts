import {
    APIGatewayProxyEventSchema,
    APIGatewayProxyEventV2Schema,
    APIGatewayRequestAuthorizerEventSchema,
    APIGatewayRequestAuthorizerEventV2Schema,
    DynamoDBStreamSchema,
    EventBridgeSchema,
    KinesisDataStreamSchema,
    KinesisFirehoseSchema,
    S3Schema,
    SnsSchema,
    SqsSchema,
} from '@aws-lambda-powertools/parser/schemas'
import { asyncForAll, json, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { rawHandler } from './raw.js'

it('handles schema types', () => {
    const handler = rawHandler({
        raw: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<'payload'>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.raw.handler).toEqualTypeOf<(request: 'payload') => 'result'>()
})

it('handles schema types - zod', () => {
    const handler = rawHandler({
        raw: {
            schema: { payload: z.literal('payload'), result: z.literal('result') },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<'payload'>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.raw.handler).toEqualTypeOf<(request: 'payload') => 'result'>()
})

it('handles schema types - default', () => {
    const handler = rawHandler({
        raw: {
            schema: {},
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<unknown>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.raw.handler).toEqualTypeOf<(request: unknown) => 'result'>()
})

it('handles service and config types', () => {
    {
        const handler = rawHandler({
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<undefined, undefined, undefined>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            config: 'config' as const,
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<'config', undefined, undefined>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            config: () => 'config' as const,
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<'config', undefined, undefined>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            services: { services: 'services' as const },
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<undefined, { services: 'services' }, undefined>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            services: () => ({ services: 'services' as const }),
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<undefined, { services: 'services' }, undefined>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<'config', { services: 'services' }, undefined>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            profile: { schema: literalSchema<'profile'>() },
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => 'result'
        >()
    }
    {
        const handler = rawHandler({
            profile: { schema: z.literal('profile') },
            raw: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return 'result' as const
                },
            },
        })
        expectTypeOf(handler.raw.handler).toEqualTypeOf<
            (request: unknown, context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>) => 'result'
        >()
    }
})

it('handles schema types and gives errors', () => {
    rawHandler({
        raw: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return 'not-result' as const
            },
        },
    })
})

it('does handle raw events', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: vi.fn(), schema: {} },
        },
        { _kernel: raw },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
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
                arbitrary(DynamoDBStreamSchema),
                json(),
                unknown(),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            raw.mockClear()
            raw.mockReturnValue(ret)
            const response = await handler._options.handler(event as any, ctx)
            expect(response).toBe(ret)
            expect(raw).toHaveBeenCalledWith(expect.anything(), event, ctx)
        },
    )
})

it('warmup should early exit', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: raw, schema: {} },
        },
        { _kernel: raw },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(raw).not.toHaveBeenCalled()
})
