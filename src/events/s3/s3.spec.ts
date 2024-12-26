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
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { s3Handler } from './s3.js'
import type { S3Event } from './types.js'

it('handles service and config types', () => {
    {
        const handler = s3Handler({
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<undefined, undefined, undefined>) => void
        >()
    }
    {
        const handler = s3Handler({
            config: 'config' as const,
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = s3Handler({
            config: () => 'config' as const,
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = s3Handler({
            services: { services: 'services' as const },
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = s3Handler({
            services: () => ({ services: 'services' as const }),
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = s3Handler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<'config', { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = s3Handler({
            profile: { schema: literalSchema<'profile'>() },
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => void
        >()
    }
    {
        const handler = s3Handler({
            profile: { schema: z.literal('profile') },
            s3: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.s3.handler).toEqualTypeOf<
            (request: NoInfer<S3Event>, context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>) => void
        >()
    }
})

it('handles s3 events', async () => {
    const s3 = vi.fn()
    const handler = s3Handler(
        {
            s3: { handler: vi.fn() },
        },
        { _kernel: s3 },
    )
    await asyncForAll(tuple(arbitrary(S3Schema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        s3.mockClear()
        s3.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(s3).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('does not handle non kinesis events', async () => {
    const s3 = vi.fn()
    const handler = s3Handler(
        {
            s3: { handler: vi.fn() },
        },
        { _kernel: s3 },
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
                // arbitrary(S3Event),
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
            s3.mockClear()
            s3.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const s3 = vi.fn()
    const handler = s3Handler(
        {
            s3: { handler: s3 },
        },
        { _kernel: s3 },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(s3).not.toHaveBeenCalled()
})
