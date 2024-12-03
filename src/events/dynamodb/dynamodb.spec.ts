import { dynamodbHandler } from './dynamodb.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { KinesisDataStreamSchema } from '../../aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../aws/s3-batch/s3.type.js'
import { S3Schema } from '../../aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../aws/secret-rotation/secret-rotation.type.js'
import { context } from '../../test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { APIGatewayProxyEventV2Schema, APIGatewayRequestAuthorizerEventV2Schema } from '../../aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema, APIGatewayRequestAuthorizerEventSchema } from '../../aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../aws/firehose/firehose.type.js'
import { SnsSchema } from '../../aws/sns/sns.type.js'
import { SqsSchema } from '../../aws/sqs/sqs.type.js'
import type { LambdaContext } from '../types.js'
import type { DynamoDBStreamEvent } from './types.js'

it('handles service and config types', () => {
    {
        const handler = dynamodbHandler({
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (request: NoInfer<DynamoDBStreamEvent>, context: LambdaContext<undefined, undefined, undefined>) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            config: 'config' as const,
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (request: NoInfer<DynamoDBStreamEvent>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            config: () => 'config' as const,
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (request: NoInfer<DynamoDBStreamEvent>, context: LambdaContext<'config', undefined, undefined>) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            services: { services: 'services' as const },
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (
                request: NoInfer<DynamoDBStreamEvent>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            services: () => ({ services: 'services' as const }),
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (
                request: NoInfer<DynamoDBStreamEvent>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (request: NoInfer<DynamoDBStreamEvent>, context: LambdaContext<'config', { services: 'services' }, undefined>) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            profile: { schema: literalSchema<'profile'>() },
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (request: NoInfer<DynamoDBStreamEvent>, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => void
        >()
    }
    {
        const handler = dynamodbHandler({
            profile: { schema: z.literal('profile') },
            dynamodb: {
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                },
            },
        })
        expectTypeOf(handler.dynamodb.handler).toEqualTypeOf<
            (request: NoInfer<DynamoDBStreamEvent>, context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>) => void
        >()
    }
})

it('handles dynamodb events', async () => {
    const dynamodb = vi.fn()
    const handler = dynamodbHandler(
        {
            dynamodb: { handler: vi.fn() },
        },
        { _kernel: dynamodb },
    )
    await asyncForAll(tuple(arbitrary(DynamoDBStreamSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        dynamodb.mockClear()
        dynamodb.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(dynamodb).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('does not handle non dynamodb events', async () => {
    const dynamodb = vi.fn()
    const handler = dynamodbHandler(
        {
            dynamodb: { handler: vi.fn() },
        },
        { _kernel: dynamodb },
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
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                // arbitrary(DynamoDBStreamSchema),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            dynamodb.mockClear()
            dynamodb.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const dynamodb = vi.fn()
    const handler = dynamodbHandler(
        {
            dynamodb: { handler: dynamodb },
        },
        { _kernel: dynamodb },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(dynamodb).not.toHaveBeenCalled()
})
