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
import { array, asyncForAll, json, object, oneOf, random, record, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { type Schema, z } from 'zod'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import type { KinesisFirehoseRecord } from '../../aws/firehose/firehose.type.js'
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { firehoseHandler } from './firehose.js'
import type { FirehoseTransformationEvent } from './types.js'

it('handles firehose events', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: vi.fn(), schema: {} },
        },
        { _kernel: firehose },
    )
    await asyncForAll(tuple(arbitrary(KinesisFirehoseSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        firehose.mockClear()
        firehose.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(firehose).toHaveBeenCalledWith(expect.anything(), event.records, ctx)
    })
})

it('handles schema types', () => {
    const handler = firehoseHandler({
        firehose: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<FirehoseTransformationEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<KinesisFirehoseRecord>()

                return { status: 'Ok', payload: 'result' } as const
            },
        },
    })
    expectTypeOf(handler.firehose.handler).toEqualTypeOf<
        (request: NoInfer<FirehoseTransformationEvent<'payload'>>) => {
            readonly status: 'Ok'
            readonly payload: 'result'
        }
    >()
})

it('handles schema types - zod', () => {
    const handler = firehoseHandler({
        firehose: {
            schema: { payload: z.literal('payload'), result: z.literal('result') },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<FirehoseTransformationEvent<'payload'>>()
                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                expectTypeOf(request.raw).toEqualTypeOf<KinesisFirehoseRecord>()

                return { status: 'Ok', payload: 'result' } as const
            },
        },
    })
    expectTypeOf(handler.firehose.handler).toEqualTypeOf<
        (request: NoInfer<FirehoseTransformationEvent<'payload'>>) => {
            readonly status: 'Ok'
            readonly payload: 'result'
        }
    >()
})

it('handles schema types - default', () => {
    const handler = firehoseHandler({
        firehose: {
            schema: {},
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<FirehoseTransformationEvent<unknown>>()
                expectTypeOf(request.payload).toEqualTypeOf<unknown>()
                expectTypeOf(request.raw).toEqualTypeOf<KinesisFirehoseRecord>()

                return { status: 'Ok', payload: 'result' } as const
            },
        },
    })
    expectTypeOf(handler.firehose.handler).toEqualTypeOf<
        (request: NoInfer<FirehoseTransformationEvent<unknown>>) => {
            readonly status: 'Ok'
            readonly payload: 'result'
        }
    >()
})

it('handles service and config types', () => {
    {
        const handler = firehoseHandler({
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<undefined, undefined, undefined>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            config: 'config' as const,
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            config: () => 'config' as const,
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            services: { services: 'services' as const },
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            services: () => ({ services: 'services' as const }),
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<'config', { services: 'services' }, undefined>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            profile: { schema: literalSchema<'profile'>() },
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<undefined, undefined, Schema<'profile'>>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
    {
        const handler = firehoseHandler({
            profile: { schema: z.literal('profile') },
            firehose: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return { status: 'Ok', payload: 'result' } as const
                },
            },
        })
        expectTypeOf(handler.firehose.handler).toEqualTypeOf<
            (
                request: NoInfer<FirehoseTransformationEvent<unknown>>,
                context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>,
            ) => {
                readonly status: 'Ok'
                readonly payload: 'result'
            }
        >()
    }
})

it('handles schema types and gives errors', () => {
    firehoseHandler({
        firehose: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return { status: 'Ok', payload: 'not-result' } as const
            },
        },
    })
})

it('does not handle non firehose events', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: vi.fn(), schema: {} },
        },
        { _kernel: firehose },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                // arbitrary(FirehoseTransformationEvent),
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
                object({ records: array(record(json()), { minLength: 1 }) }),
                arbitrary(DynamoDBStreamSchema),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            firehose.mockClear()
            firehose.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: firehose, schema: {} },
        },
        { _kernel: firehose },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(firehose).not.toHaveBeenCalled()
})
