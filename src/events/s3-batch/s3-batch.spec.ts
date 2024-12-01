import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEventV2Schema, APIGatewayRequestAuthorizerEventV2Schema } from '../../aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema, APIGatewayRequestAuthorizerEventSchema } from '../../aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../aws/firehose/firehose.type.js'
import { KinesisDataStreamSchema } from '../../aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../aws/s3-batch/s3.type.js'
import { S3Schema } from '../../aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../aws/secret-rotation/secret-rotation.type.js'
import { SnsSchema } from '../../aws/sns/sns.type.js'
import { SqsSchema } from '../../aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { s3BatchHandler } from './s3-batch.js'
import type { S3BatchTask } from './types.js'

it('handles s3Batch events', async () => {
    const s3Batch = vi.fn()
    const handler = s3BatchHandler(
        {
            s3Batch: { handler: vi.fn(), schema: {} },
        },
        { _kernel: s3Batch },
    )
    await asyncForAll(tuple(arbitrary(S3BatchEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        s3Batch.mockClear()
        s3Batch.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(s3Batch).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('handles schema types', () => {
    const handler = s3BatchHandler({
        s3Batch: {
            schema: { result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<S3BatchTask>()
                return { status: 'Succeeded', payload: 'result' } as const
            },
        },
    })
    expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
        (request: NoInfer<S3BatchTask>) => {
            readonly status: 'Succeeded'
            readonly payload: 'result'
        }
    >()
})

it('handles schema types - zod', () => {
    const handler = s3BatchHandler({
        s3Batch: {
            schema: { result: z.literal('result') },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<S3BatchTask>()
                return { status: 'Succeeded', payload: 'result' } as const
            },
        },
    })
    expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
        (request: NoInfer<S3BatchTask>) => {
            readonly status: 'Succeeded'
            readonly payload: 'result'
        }
    >()
})

it('handles schema types - default', () => {
    const handler = s3BatchHandler({
        s3Batch: {
            schema: {},
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<S3BatchTask>()
                return { status: 'Succeeded', payload: 'result' }
            },
        },
    })
    expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
        (request: NoInfer<S3BatchTask>) => {
            status: 'Succeeded'
            payload: string
        }
    >()
})

it('handles service and config types', () => {
    {
        const handler = s3BatchHandler({
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<undefined, undefined, undefined>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            config: 'config' as const,
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            config: () => 'config' as const,
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            services: { services: 'services' as const },
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            services: () => ({ services: 'services' as const }),
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<'config', { services: 'services' }, undefined>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            profile: { schema: literalSchema<'profile'>() },
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<undefined, undefined, Schema<'profile'>>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
    {
        const handler = s3BatchHandler({
            profile: { schema: z.literal('profile') },
            s3Batch: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return { status: 'Succeeded', payload: 'result' }
                },
            },
        })
        expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
            (
                request: NoInfer<S3BatchTask>,
                context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>,
            ) => {
                status: 'Succeeded'
                payload: string
            }
        >()
    }
})

it('handles schema types and gives errors', () => {
    s3BatchHandler({
        s3Batch: {
            schema: { result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return { status: 'Succeeded', payload: 'not-result' as const }
            },
        },
    })
})

it('does not handle non s3Batch events', async () => {
    const s3Batch = vi.fn()
    const handler = s3BatchHandler(
        {
            s3Batch: { handler: vi.fn(), schema: {} },
        },
        { _kernel: s3Batch },
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
                // arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            s3Batch.mockClear()
            s3Batch.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const s3Batch = vi.fn()
    const handler = s3BatchHandler(
        {
            s3Batch: { handler: s3Batch, schema: {} },
        },
        { _kernel: s3Batch },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(s3Batch).not.toHaveBeenCalled()
})
