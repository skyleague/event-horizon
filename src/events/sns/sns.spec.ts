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
import type { SnsNotificationSchema } from '../../aws/sns/sns.type.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { snsHandler } from './sns.js'
import type { SNSEvent } from './types.js'

it('handles sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { _kernel: sns },
    )
    await asyncForAll(tuple(arbitrary(SnsSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        sns.mockClear()
        sns.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(sns).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('handles schema types', () => {
    const handler = snsHandler({
        sns: {
            schema: { payload: literalSchema<'payload'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<SNSEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<SnsNotificationSchema>()
            },
        },
    })
    expectTypeOf(handler.sns.handler).toEqualTypeOf<(request: SNSEvent<'payload'>) => void>()
})

it('handles schema types - zod', () => {
    const handler = snsHandler({
        sns: {
            schema: { payload: z.literal('payload') },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<SNSEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<SnsNotificationSchema>()
            },
        },
    })
    expectTypeOf(handler.sns.handler).toEqualTypeOf<(request: SNSEvent<'payload'>) => void>()
})

it('handles schema types - dfault', () => {
    const handler = snsHandler({
        sns: {
            schema: {},
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<SNSEvent<unknown>>()
                expectTypeOf(request.payload).toEqualTypeOf<unknown>()
                expectTypeOf(request.raw).toEqualTypeOf<SnsNotificationSchema>()
            },
        },
    })
    expectTypeOf(handler.sns.handler).toEqualTypeOf<(request: SNSEvent<unknown>) => void>()
})

it('handles service and config types', () => {
    {
        const handler = snsHandler({
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<undefined, undefined, undefined>) => void
        >()
    }
    {
        const handler = snsHandler({
            config: 'config' as const,
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = snsHandler({
            config: () => 'config' as const,
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = snsHandler({
            services: { services: 'services' as const },
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = snsHandler({
            services: () => ({ services: 'services' as const }),
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = snsHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<'config', { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = snsHandler({
            profile: { schema: literalSchema<'profile'>() },
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => void
        >()
    }
    {
        const handler = snsHandler({
            profile: { schema: z.literal('profile') },
            sns: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.sns.handler).toEqualTypeOf<
            (request: SNSEvent<unknown>, context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>) => void
        >()
    }
})

it('does not handle non sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { _kernel: sns },
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
                // arbitrary(SnsSchema)
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            sns.mockClear()
            sns.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: sns, schema: {} },
        },
        { _kernel: sns },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(sns).not.toHaveBeenCalled()
})
