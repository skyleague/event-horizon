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
import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import type { KinesisDataStreamRecord } from '../../aws/kinesis/kinesis.type.js'
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { kinesisHandler } from './kinesis.js'
import type { KinesisEvent } from './types.js'

it('handles kinesis events', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: vi.fn(), schema: {} },
        },
        { _kernel: kinesis },
    )
    await asyncForAll(tuple(arbitrary(KinesisDataStreamSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        kinesis.mockClear()
        kinesis.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(kinesis).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('handles schema types', () => {
    const handler = kinesisHandler({
        kinesis: {
            schema: { payload: literalSchema<'payload'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<KinesisEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<KinesisDataStreamRecord>()
            },
        },
    })
    expectTypeOf(handler.kinesis.handler).toEqualTypeOf<(request: KinesisEvent<'payload'>) => void>()
})

it('handles schema types - zod', () => {
    const handler = kinesisHandler({
        kinesis: {
            schema: { payload: z.literal('payload') },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<KinesisEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<KinesisDataStreamRecord>()
            },
        },
    })
    expectTypeOf(handler.kinesis.handler).toEqualTypeOf<(request: KinesisEvent<'payload'>) => void>()
})

it('handles schema types - default', () => {
    const handler = kinesisHandler({
        kinesis: {
            schema: {},
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<KinesisEvent<unknown>>()
                expectTypeOf(request.payload).toEqualTypeOf<unknown>()
                expectTypeOf(request.raw).toEqualTypeOf<KinesisDataStreamRecord>()
            },
        },
    })
    expectTypeOf(handler.kinesis.handler).toEqualTypeOf<(request: KinesisEvent<unknown>) => void>()
})

it('handles service and config types', () => {
    {
        const handler = kinesisHandler({
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (request: NoInfer<KinesisEvent<unknown>>, context: LambdaContext<undefined, undefined, undefined>) => void
        >()
    }
    {
        const handler = kinesisHandler({
            config: 'config' as const,
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (request: NoInfer<KinesisEvent<unknown>>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = kinesisHandler({
            config: () => 'config' as const,
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (request: NoInfer<KinesisEvent<unknown>>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = kinesisHandler({
            services: { services: 'services' as const },
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (
                request: NoInfer<KinesisEvent<unknown>>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => void
        >()
    }
    {
        const handler = kinesisHandler({
            services: () => ({ services: 'services' as const }),
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (
                request: NoInfer<KinesisEvent<unknown>>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => void
        >()
    }
    {
        const handler = kinesisHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (
                request: NoInfer<KinesisEvent<unknown>>,
                context: LambdaContext<'config', { services: 'services' }, undefined>,
            ) => void
        >()
    }
    {
        const handler = kinesisHandler({
            profile: { schema: literalSchema<'profile'>() },
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (request: NoInfer<KinesisEvent<unknown>>, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => void
        >()
    }
    {
        const handler = kinesisHandler({
            profile: { schema: z.literal('profile') },
            kinesis: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.kinesis.handler).toEqualTypeOf<
            (
                request: NoInfer<KinesisEvent<unknown>>,
                context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>,
            ) => void
        >()
    }
})

it('does not handle non kinesis events', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: vi.fn(), schema: {} },
        },
        { _kernel: kinesis },
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
                // arbitrary(KinesisStreamEvent),
                arbitrary(S3Schema),
                arbitrary(s3BatchEvent),
                arbitrary(secretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            kinesis.mockClear()
            kinesis.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: kinesis, schema: {} },
        },
        { _kernel: kinesis },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(kinesis).not.toHaveBeenCalled()
})
