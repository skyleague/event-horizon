import {
    APIGatewayProxyEventSchema,
    APIGatewayProxyEventV2Schema,
    APIGatewayRequestAuthorizerEventV2Schema as AWSAPIGatewayRequestAuthorizerEventV2Schema,
    DynamoDBStreamSchema,
    EventBridgeSchema,
    KinesisDataStreamSchema,
    KinesisFirehoseSchema,
    S3Schema,
    SnsSchema,
    SqsSchema,
} from '@aws-lambda-powertools/parser/schemas'
import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary, type Schema } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../../test/schema.js'
import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../aws/http.js'
import { s3BatchEvent } from '../../../aws/s3-batch/s3.schema.js'
import { secretRotationEvent } from '../../../aws/secret-rotation/secret-rotation.schema.js'
import { context } from '../../../test/context/context.js'
import type { LambdaContext } from '../../types.js'
import type { HTTPHeaders, HTTPPathParameters, HTTPQueryParameters } from '../types.js'
import { httpApiAuthorizer } from './http.js'
import type { RequestAuthorizerEvent } from './types.js'

it('handles authorizer events', async () => {
    const http = vi.fn()
    const handler = httpApiAuthorizer(
        {
            request: {
                schema: {},
                handler: vi.fn() as any,
            },
        },
        { _kernel: http },
    )

    await asyncForAll(
        tuple(arbitrary(AWSAPIGatewayRequestAuthorizerEventV2Schema), unknown(), await context(handler)),
        async ([event, ret, ctx]) => {
            http.mockClear()
            http.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(http).toHaveBeenCalledWith(expect.anything(), event, ctx)
        },
    )
})

it('handles schema types', () => {
    const handler = httpApiAuthorizer({
        request: {
            schema: {
                context: literalSchema<'context'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
            },
            security: {
                foo: {
                    type: 'apiKey',
                    name: 'api_key',
                    in: 'header',
                },
            },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    RequestAuthorizerEvent<
                        'path',
                        'query',
                        'headers',
                        {
                            readonly foo: {
                                readonly type: 'apiKey'
                                readonly name: 'api_key'
                                readonly in: 'header'
                            }
                        },
                        'http'
                    >
                >()
                expectTypeOf(request.path).toEqualTypeOf<'path'>()
                expectTypeOf(request.query).toEqualTypeOf<'query'>()
                expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: {
                        readonly type: 'apiKey'
                        readonly name: 'api_key'
                        readonly in: 'header'
                    }
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayRequestAuthorizerEventV2Schema>()

                return {
                    isAuthorized: true,
                    context: 'context' as const,
                }
            },
        },
    })
    expectTypeOf(handler.request.handler).toEqualTypeOf<
        (
            request: RequestAuthorizerEvent<
                'path',
                'query',
                'headers',
                {
                    readonly foo: {
                        readonly type: 'apiKey'
                        readonly name: 'api_key'
                        readonly in: 'header'
                    }
                },
                'http'
            >,
        ) => {
            isAuthorized: true
            context: 'context'
        }
    >()
})

it('handles schema types - zod', () => {
    const handler = httpApiAuthorizer({
        request: {
            schema: {
                context: z.literal('context'),
                path: z.literal('path'),
                query: z.literal('query'),
                headers: z.literal('headers'),
            },
            security: {
                foo: {
                    type: 'apiKey',
                    name: 'api_key',
                    in: 'header',
                },
            },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    RequestAuthorizerEvent<
                        'path',
                        'query',
                        'headers',
                        {
                            readonly foo: {
                                readonly type: 'apiKey'
                                readonly name: 'api_key'
                                readonly in: 'header'
                            }
                        },
                        'http'
                    >
                >()
                expectTypeOf(request.path).toEqualTypeOf<'path'>()
                expectTypeOf(request.query).toEqualTypeOf<'query'>()
                expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: {
                        readonly type: 'apiKey'
                        readonly name: 'api_key'
                        readonly in: 'header'
                    }
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayRequestAuthorizerEventV2Schema>()

                return {
                    isAuthorized: true,
                    context: 'context' as const,
                }
            },
        },
    })
    expectTypeOf(handler.request.handler).toEqualTypeOf<
        (
            request: RequestAuthorizerEvent<
                'path',
                'query',
                'headers',
                {
                    readonly foo: {
                        readonly type: 'apiKey'
                        readonly name: 'api_key'
                        readonly in: 'header'
                    }
                },
                'http'
            >,
        ) => {
            isAuthorized: true
            context: 'context'
        }
    >()
})

it('handles schema types - default', () => {
    const handler = httpApiAuthorizer({
        request: {
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayRequestAuthorizerEventV2Schema>()

                return {
                    isAuthorized: true,
                    context: 'context' as const,
                }
            },
        },
    })
    expectTypeOf(handler.request.handler).toEqualTypeOf<
        (request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>) => {
            isAuthorized: true
            context: 'context'
        }
    >()
})

it('handles service and config types', () => {
    {
        const handler = httpApiAuthorizer({
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<undefined, undefined, undefined>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            config: 'config' as const,
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            config: () => 'config' as const,
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            services: { services: 'services' as const },
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            services: () => ({ services: 'services' as const }),
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<'config', { services: 'services' }, undefined>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            profile: { schema: literalSchema<'profile'>() },
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<undefined, undefined, Schema<'profile'>>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
    {
        const handler = httpApiAuthorizer({
            profile: { schema: z.literal('profile') },
            request: {
                schema: {},
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return {
                        isAuthorized: true,
                        context: 'context' as const,
                    }
                },
            },
        })
        expectTypeOf(handler.request.handler).toEqualTypeOf<
            (
                request: RequestAuthorizerEvent<undefined, undefined, undefined, undefined, 'http'>,
                context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>,
            ) => {
                isAuthorized: true
                context: 'context'
            }
        >()
    }
})

it('handles schema types and gives errors', () => {
    httpApiAuthorizer({
        request: {
            schema: {
                context: literalSchema<'context'>(),
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    isAuthorized: true,
                    context: 'not-context' as const,
                }
            },
        },
    })
})

it('does not handle non authorizer events', async () => {
    const http = vi.fn()
    const handler = httpApiAuthorizer(
        {
            request: {
                handler: vi.fn() as any,
            },
        },
        { _kernel: http },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                // arbitrary(APIGatewayRequestAuthorizerEventSchema),
                // arbitrary(APIGatewayRequestAuthorizerEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(s3BatchEvent),
                arbitrary(secretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            http.mockClear()
            http.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const http = vi.fn()
    const handler = httpApiAuthorizer(
        {
            request: {
                schema: { responses: {} },
                handler: http,
            },
        },
        { _kernel: http },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(http).not.toHaveBeenCalled()
})
