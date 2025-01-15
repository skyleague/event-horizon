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
import { type Try, asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import type { SQSBatchItemFailure } from 'aws-lambda'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { s3BatchEvent } from '../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../aws/secret-rotation/secret-rotation.schema.js'
import type { SqsRecordSchema } from '../../aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'
import type { LambdaContext } from '../types.js'
import { sqsGroupHandler, sqsHandler } from './sqs.js'
import type { SQSEvent, SQSMessageGroup } from './types.js'

describe('sqsHandler', () => {
    it('handles sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
        )
        await asyncForAll(tuple(arbitrary(SqsSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
            sqs.mockClear()
            sqs.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
        })
    })

    it('handles schema types', () => {
        const handler = sqsHandler({
            sqs: {
                schema: { payload: literalSchema<'payload'>() },
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSEvent<'payload'>>()
                    expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                    expectTypeOf(request.raw).toEqualTypeOf<SqsRecordSchema>()
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSEvent<'payload'>) => void>()
    })

    it('handles schema types - zod', () => {
        const handler = sqsHandler({
            sqs: {
                schema: { payload: z.literal('payload') },
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSEvent<'payload'>>()
                    expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
                    expectTypeOf(request.raw).toEqualTypeOf<SqsRecordSchema>()
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSEvent<'payload'>) => void>()
    })

    it('handles schema types - default', () => {
        const handler = sqsHandler({
            sqs: {
                schema: {},
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSEvent<unknown>>()
                    expectTypeOf(request.payload).toEqualTypeOf<unknown>()
                    expectTypeOf(request.raw).toEqualTypeOf<SqsRecordSchema>()
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSEvent<unknown>) => void>()
    })

    it('handles service and config types', () => {
        {
            const handler = sqsHandler({
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                        expectTypeOf(context.config).toEqualTypeOf<never>()
                        expectTypeOf(context.services).toEqualTypeOf<never>()
                        expectTypeOf(context.profile).toEqualTypeOf<never>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<undefined, undefined, undefined>) => void
            >()
        }
        {
            const handler = sqsHandler({
                config: 'config' as const,
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                        expectTypeOf(context.config).toEqualTypeOf<'config'>()
                        expectTypeOf(context.services).toEqualTypeOf<never>()
                        expectTypeOf(context.profile).toEqualTypeOf<never>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<'config', undefined, undefined>) => void
            >()
        }
        {
            const handler = sqsHandler({
                config: () => 'config' as const,
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                        expectTypeOf(context.config).toEqualTypeOf<'config'>()
                        expectTypeOf(context.services).toEqualTypeOf<never>()
                        expectTypeOf(context.profile).toEqualTypeOf<never>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<'config', undefined, undefined>) => void
            >()
        }
        {
            const handler = sqsHandler({
                services: { services: 'services' as const },
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                        expectTypeOf(context.config).toEqualTypeOf<never>()
                        expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                        expectTypeOf(context.profile).toEqualTypeOf<never>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
            >()
        }
        {
            const handler = sqsHandler({
                services: () => ({ services: 'services' as const }),
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                        expectTypeOf(context.config).toEqualTypeOf<never>()
                        expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                        expectTypeOf(context.profile).toEqualTypeOf<never>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<undefined, { services: 'services' }, undefined>) => void
            >()
        }
        {
            const handler = sqsHandler({
                config: () => 'config' as const,
                services: (config) => {
                    expectTypeOf(config).toEqualTypeOf<'config'>()
                    return { services: 'services' as const }
                },
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                        expectTypeOf(context.config).toEqualTypeOf<'config'>()
                        expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                        expectTypeOf(context.profile).toEqualTypeOf<never>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<'config', { services: 'services' }, undefined>) => void
            >()
        }
        {
            const handler = sqsHandler({
                profile: { schema: literalSchema<'profile'>() },
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                        expectTypeOf(context.config).toEqualTypeOf<never>()
                        expectTypeOf(context.services).toEqualTypeOf<never>()
                        expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<undefined, undefined, Schema<'profile'>>) => void
            >()
        }
        {
            const handler = sqsHandler({
                profile: { schema: z.literal('profile') },
                sqs: {
                    schema: {},
                    handler: (_, context) => {
                        expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                        expectTypeOf(context.config).toEqualTypeOf<never>()
                        expectTypeOf(context.services).toEqualTypeOf<never>()
                        expectTypeOf(context.profile).toEqualTypeOf<'profile'>()
                    },
                },
            })
            expectTypeOf(handler.sqs.handler).toEqualTypeOf<
                (request: SQSEvent<unknown>, context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>) => void
            >()
        }
    })

    it('does not handle non sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
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
                    // arbitrary(SQSEvent),
                    arbitrary(DynamoDBStreamSchema),
                ).filter((e) => !('Records' in e) || e.Records.length > 0),
                unknown(),
                await context(handler),
            ),
            async ([event, ret, ctx]) => {
                sqs.mockClear()
                sqs.mockReturnValue(ret)
                await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                    /Lambda was invoked with an unexpected event type/,
                )
            },
        )
    })

    it('warmup should early exit', async () => {
        const sqs = vi.fn()
        const handler = sqsHandler(
            {
                sqs: { handler: sqs, schema: {} },
            },
            { _kernel: sqs },
        )

        await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
        expect(sqs).not.toHaveBeenCalled()
    })
})

describe('sqsGroupHandler', () => {
    it('handles sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsGroupHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
        )
        await asyncForAll(tuple(arbitrary(SqsSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
            sqs.mockClear()
            sqs.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
        })
    })

    it('handles schema types', () => {
        const handler = sqsGroupHandler({
            sqs: {
                schema: { payload: literalSchema<'payload'>() },
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSMessageGroup<'payload'>>()
                    expectTypeOf(request.records).toEqualTypeOf<SQSEvent<Try<'payload'>>[]>()

                    return [{ itemIdentifier: 'sdf' }]
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSMessageGroup<'payload'>) => SQSBatchItemFailure[]>()
    })

    it('handles schema types - zod', () => {
        const handler = sqsGroupHandler({
            sqs: {
                schema: { payload: z.literal('payload') },
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSMessageGroup<'payload'>>()
                    expectTypeOf(request.records).toEqualTypeOf<SQSEvent<Try<'payload'>>[]>()

                    return [{ itemIdentifier: 'sdf' }]
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSMessageGroup<'payload'>) => SQSBatchItemFailure[]>()
    })

    it('handles schema types - default', () => {
        const handler = sqsGroupHandler({
            sqs: {
                schema: {},
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSMessageGroup<unknown>>()
                    expectTypeOf(request.records).toEqualTypeOf<SQSEvent<Try<unknown>>[]>()

                    return [{ itemIdentifier: 'sdf' }]
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSMessageGroup<unknown>) => SQSBatchItemFailure[]>()
    })

    it('does not handle non sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsGroupHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
        )
        await asyncForAll(
            tuple(
                oneOf(
                    arbitrary(EventBridgeSchema),
                    arbitrary(KinesisFirehoseSchema),
                    arbitrary(APIGatewayProxyEventSchema),
                    arbitrary(APIGatewayProxyEventV2Schema),
                    arbitrary(KinesisDataStreamSchema),
                    arbitrary(S3Schema),
                    arbitrary(s3BatchEvent),
                    arbitrary(secretRotationEvent),
                    arbitrary(SnsSchema),
                    // arbitrary(SQSEvent),
                    arbitrary(DynamoDBStreamSchema),
                ).filter((e) => !('Records' in e) || e.Records.length > 0),
                unknown(),
                await context(handler),
            ),
            async ([event, ret, ctx]) => {
                sqs.mockClear()
                sqs.mockReturnValue(ret)
                await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                    /Lambda was invoked with an unexpected event type/,
                )
            },
        )
    })

    it('warmup should early exit', async () => {
        const sqs = vi.fn()
        const handler = sqsGroupHandler(
            {
                sqs: { handler: sqs, schema: {} },
            },
            { _kernel: sqs },
        )

        await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
        expect(sqs).not.toHaveBeenCalled()
    })
})
