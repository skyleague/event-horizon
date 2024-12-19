import { constants, alpha, asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { literalSchema, warmerEvent } from '../../../../test/schema.js'
import { APIGatewayProxyEventV2Schema } from '../../../aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../../aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../../aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../../aws/firehose/firehose.type.js'
import { KinesisDataStreamSchema } from '../../../aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../../aws/s3-batch/s3.type.js'
import { S3Schema } from '../../../aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../../aws/secret-rotation/secret-rotation.type.js'
import { SnsSchema } from '../../../aws/sns/sns.type.js'
import { SqsSchema } from '../../../aws/sqs/sqs.type.js'
import { restApiEvent } from '../../../dev/event-horizon/apigateway/event/rest.js'
import { context } from '../../../test/context/context.js'
import type { LambdaContext } from '../../types.js'
import type { HTTPHeaders, HTTPPathParameters, HTTPQueryParameters } from '../types.js'
import { restApiHandler } from './http.js'
import type { AnyAuthorizerContext, AuthorizerSchema, HTTPRequest, RestIamAuthorizer } from './types.js'

const method = random(constants('get', 'put'))
const path = `/${random(alpha())}` as const

it('handles http events', async () => {
    const http = vi.fn()
    const handler = restApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext',
                handler: vi.fn() as any,
            },
        },
        { _kernel: http },
    )

    await asyncForAll(
        tuple(arbitrary(APIGatewayProxyEventV2Schema), unknown(), await context(handler)),
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
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                body: literalSchema<'body'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
                responses: { 200: literalSchema<'200-response'>() },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        'body',
                        'path',
                        'query',
                        'headers',
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        AuthorizerSchema<'rest'>
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<'body'>()
                expectTypeOf(request.path).toEqualTypeOf<'path'>()
                expectTypeOf(request.query).toEqualTypeOf<'query'>()
                expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
                expectTypeOf(request.security).toEqualTypeOf<{ readonly foo: []; readonly bar: [] }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                'body',
                'path',
                'query',
                'headers',
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                AuthorizerSchema<'rest'>
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles schema types - zod', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                body: z.object({ body: z.string() }),
                path: z.object({ path: z.string() }),
                query: z.object({ query: z.string() }),
                headers: z.object({ headers: z.string() }),
                responses: { 200: z.object({ '200-response': z.string() }) },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        { body: string },
                        { path: string },
                        { query: string },
                        { headers: string },
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        AuthorizerSchema<'rest'>
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<{ body: string }>()
                expectTypeOf(request.path).toEqualTypeOf<{ path: string }>()
                expectTypeOf(request.query).toEqualTypeOf<{ query: string }>()
                expectTypeOf(request.headers).toEqualTypeOf<{ headers: string }>()
                expectTypeOf(request.security).toEqualTypeOf<{ readonly foo: []; readonly bar: [] }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: { '200-response': 'bar' },
                }
            },
        },
    })

    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                { body: string },
                { path: string },
                { query: string },
                { headers: string },
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                AuthorizerSchema<'rest'>
            >,
        ) => {
            statusCode: 200
            body: { '200-response': string }
        }
    >()
})

it('handles schema types - default', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200 as number,
                    body: '200-response',
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>) => {
            statusCode: number
            body: string
        }
    >()
})

it('handles service and config types', () => {
    {
        const handler = restApiHandler({
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<undefined, undefined, undefined>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            config: 'config' as const,
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            config: () => 'config' as const,
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', undefined, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<'config', undefined, undefined>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            services: { services: 'services' as const },
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            services: () => ({ services: 'services' as const }),
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<undefined, { services: 'services' }, undefined>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            config: () => 'config' as const,
            services: (config) => {
                expectTypeOf(config).toEqualTypeOf<'config'>()
                return { services: 'services' as const }
            },
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<'config', { services: 'services' }, undefined>>()
                    expectTypeOf(context.config).toEqualTypeOf<'config'>()
                    expectTypeOf(context.services).toEqualTypeOf<{ services: 'services' }>()
                    expectTypeOf(context.profile).toEqualTypeOf<never>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<'config', { services: 'services' }, undefined>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            profile: { schema: literalSchema<'profile'>() },
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, Schema<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<undefined, undefined, Schema<'profile'>>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
    {
        const handler = restApiHandler({
            profile: { schema: z.literal('profile') },
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: (_, context) => {
                    expectTypeOf(context).toEqualTypeOf<LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>>()
                    expectTypeOf(context.config).toEqualTypeOf<never>()
                    expectTypeOf(context.services).toEqualTypeOf<never>()
                    expectTypeOf(context.profile).toEqualTypeOf<'profile'>()

                    return {
                        statusCode: 200 as number,
                        body: '200-response',
                    }
                },
            },
        })
        expectTypeOf(handler.http.handler).toEqualTypeOf<
            (
                request: HTTPRequest<undefined, undefined, undefined, undefined, undefined, 'rest', AuthorizerSchema<'rest'>>,
                context: LambdaContext<undefined, undefined, z.ZodLiteral<'profile'>>,
            ) => {
                statusCode: number
                body: string
            }
        >()
    }
})

it('handles distributed schema types', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                body: literalSchema<'body'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
                responses: { 200: literalSchema<'200-response'>(), 400: literalSchema<'400-response'>() },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<'body', 'path', 'query', 'headers', undefined, 'rest', AuthorizerSchema<'rest'>>
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<'body'>()
                expectTypeOf(request.path).toEqualTypeOf<'path'>()
                expectTypeOf(request.query).toEqualTypeOf<'query'>()
                expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                if (request.body.length === 0) {
                    return {
                        statusCode: 400,
                        body: '400-response' as const,
                    }
                }
                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (request: HTTPRequest<'body', 'path', 'query', 'headers', undefined, 'rest', AuthorizerSchema<'rest'>>) =>
            | {
                  statusCode: 400
                  body: '400-response'
              }
            | {
                  statusCode: 200
                  body: '200-response'
              }
    >()
})

it('handles distributed schema types - zod', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                body: z.object({ body: z.string() }),
                path: z.object({ path: z.string() }),
                query: z.object({ query: z.string() }),
                headers: z.object({ headers: z.string() }),
                responses: {
                    200: z.object({ '200-response': z.string() }),
                    400: z.object({ '400-response': z.string() }),
                },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        { body: string },
                        { path: string },
                        { query: string },
                        { headers: string },
                        undefined,
                        'rest',
                        AuthorizerSchema<'rest'>
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<{ body: string }>()
                expectTypeOf(request.path).toEqualTypeOf<{ path: string }>()
                expectTypeOf(request.query).toEqualTypeOf<{ query: string }>()
                expectTypeOf(request.headers).toEqualTypeOf<{ headers: string }>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                if (request.body.body.length === 0) {
                    return {
                        statusCode: 400,
                        body: { '400-response': 'error' },
                    }
                }
                return {
                    statusCode: 200,
                    body: { '200-response': 'success' },
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                { body: string },
                { path: string },
                { query: string },
                { headers: string },
                undefined,
                'rest',
                AuthorizerSchema<'rest'>
            >,
        ) =>
            | {
                  statusCode: 400
                  body: { '400-response': string; '200-response'?: never }
              }
            | {
                  statusCode: 200
                  body: { '200-response': string; '400-response'?: never }
              }
    >()
})

it('handles null response types', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                body: literalSchema<'body'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
                responses: { 200: null, 400: literalSchema<'400-response'>() },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<'body', 'path', 'query', 'headers', undefined, 'rest', AuthorizerSchema<'rest'>>
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<'body'>()
                expectTypeOf(request.path).toEqualTypeOf<'path'>()
                expectTypeOf(request.query).toEqualTypeOf<'query'>()
                expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                if (request.body.length === 0) {
                    return {
                        statusCode: 400,
                        body: '400-response' as const,
                    }
                }
                return {
                    statusCode: 200,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (request: HTTPRequest<'body', 'path', 'query', 'headers', undefined, 'rest', AuthorizerSchema<'rest'>>) =>
            | {
                  statusCode: 400
                  body: '400-response'
              }
            | {
                  statusCode: 200
                  body?: never
              }
    >()
})

it('handles null response types - zod', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                body: z.object({ body: z.string() }),
                path: z.object({ path: z.string() }),
                query: z.object({ query: z.string() }),
                headers: z.object({ headers: z.string() }),
                responses: {
                    200: null,
                    400: z.object({ '400-response': z.string() }),
                },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        { body: string },
                        { path: string },
                        { query: string },
                        { headers: string },
                        undefined,
                        'rest',
                        AuthorizerSchema<'rest'>
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<{ body: string }>()
                expectTypeOf(request.path).toEqualTypeOf<{ path: string }>()
                expectTypeOf(request.query).toEqualTypeOf<{ query: string }>()
                expectTypeOf(request.headers).toEqualTypeOf<{ headers: string }>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                if (request.body.body.length === 0) {
                    return {
                        statusCode: 400,
                        body: { '400-response': 'error' },
                    }
                }
                return {
                    statusCode: 200,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                { body: string },
                { path: string },
                { query: string },
                { headers: string },
                undefined,
                'rest',
                AuthorizerSchema<'rest'>
            >,
        ) =>
            | {
                  statusCode: 400
                  body: { '400-response': string }
              }
            | {
                  statusCode: 200
                  body?: never
              }
    >()
})

it('handles full response type', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                body: literalSchema<'body'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
                responses: {
                    200: { body: literalSchema<'200-response'>() },
                    204: { body: null, headers: literalSchema<{ Location: 'location-response' }>() },
                    400: literalSchema<'400-response'>(),
                },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<'body', 'path', 'query', 'headers', undefined, 'rest', AuthorizerSchema<'rest'>>
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<'body'>()
                expectTypeOf(request.path).toEqualTypeOf<'path'>()
                expectTypeOf(request.query).toEqualTypeOf<'query'>()
                expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                if (request.body.length === 0) {
                    return {
                        statusCode: 400,
                        body: '400-response' as const,
                    }
                }
                if (request.body.length === 1) {
                    return {
                        statusCode: 204,
                        headers: { Location: 'location-response' as const },
                    }
                }
                return {
                    statusCode: 200,
                    body: '200-response' as const,
                    headers: { foo: 'foo-response' as const },
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (request: HTTPRequest<'body', 'path', 'query', 'headers', undefined, 'rest', AuthorizerSchema<'rest'>>) =>
            | { statusCode: 400; body: '400-response'; headers?: never }
            | {
                  statusCode: 200
                  body: '200-response'
                  headers: { Location?: never; foo: 'foo-response' }
              }
            | {
                  statusCode: 204
                  headers: { Location: 'location-response'; foo?: never }
                  body?: never
              }
    >()
})

it('handles full response type - zod', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            schema: {
                body: z.object({ body: z.string() }),
                path: z.object({ path: z.string() }),
                query: z.object({ query: z.string() }),
                headers: z.object({ headers: z.string() }),
                responses: {
                    200: { body: z.object({ '200-response': z.string() }) },
                    204: { body: null, headers: z.object({ Location: z.literal('location-response') }) },
                    400: z.object({ '400-response': z.string() }),
                },
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        { body: string },
                        { path: string },
                        { query: string },
                        { headers: string },
                        undefined,
                        'rest',
                        AuthorizerSchema<'rest'>
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<AnyAuthorizerContext<'rest'>>()
                expectTypeOf(request.body).toEqualTypeOf<{ body: string }>()
                expectTypeOf(request.path).toEqualTypeOf<{ path: string }>()
                expectTypeOf(request.query).toEqualTypeOf<{ query: string }>()
                expectTypeOf(request.headers).toEqualTypeOf<{ headers: string }>()
                expectTypeOf(request.security).toEqualTypeOf<[]>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                if (request.body.body.length === 0) {
                    return {
                        statusCode: 400,
                        body: { '400-response': 'error' },
                    }
                }
                if (request.body.body.length === 1) {
                    return {
                        statusCode: 204,
                        headers: { Location: 'location-response' as const },
                    }
                }
                return {
                    statusCode: 200,
                    body: { '200-response': 'success' },
                    headers: { foo: 'foo-response' },
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                { body: string },
                { path: string },
                { query: string },
                { headers: string },
                undefined,
                'rest',
                AuthorizerSchema<'rest'>
            >,
        ) =>
            | {
                  statusCode: 400
                  body: {
                      '400-response': string
                      '200-response'?: never
                  }
                  headers?: never
              }
            | {
                  statusCode: 200
                  body: {
                      '200-response': string
                      '400-response'?: never
                  }
                  headers: {
                      foo: string
                      Location?: never
                  }
              }
            | {
                  statusCode: 204
                  headers: {
                      Location: 'location-response'
                      foo?: never
                  }
                  body?: never
              }
    >()
})

it('handles authorizer schema types - jwt', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    jwt: literalSchema<{ foo: 'jwt' }>(),
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        { jwt: Schema<{ foo: 'jwt' }> }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<{
                    claims: { foo: 'jwt' }
                    scopes: string[]
                }>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                { jwt: Schema<{ foo: 'jwt' }> }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles authorizer schema types - jwt - zod', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    jwt: z.object({ foo: z.literal('jwt') }),
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        {
                            jwt: z.ZodObject<
                                {
                                    foo: z.ZodLiteral<'jwt'>
                                },
                                'strip',
                                z.ZodTypeAny,
                                {
                                    foo: 'jwt'
                                },
                                {
                                    foo: 'jwt'
                                }
                            >
                        }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<{
                    claims: { foo: 'jwt' }
                    scopes: string[]
                }>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                {
                    jwt: z.ZodObject<
                        {
                            foo: z.ZodLiteral<'jwt'>
                        },
                        'strip',
                        z.ZodTypeAny,
                        {
                            foo: 'jwt'
                        },
                        {
                            foo: 'jwt'
                        }
                    >
                }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles authorizer schema types - jwt - true', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    jwt: true,
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        { jwt: true }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<{
                    claims: Record<string, unknown>
                    scopes: string[]
                }>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                { jwt: true }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles authorizer schema types - lambda', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    lambda: literalSchema<{ foo: 'jwt' }>(),
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        { lambda: Schema<{ foo: 'jwt' }> }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<{ foo: 'jwt' }>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                { lambda: Schema<{ foo: 'jwt' }> }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles authorizer schema types - lambda - zod', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    lambda: z.object({ foo: z.literal('jwt') }),
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        {
                            lambda: z.ZodObject<
                                {
                                    foo: z.ZodLiteral<'jwt'>
                                },
                                'strip',
                                z.ZodTypeAny,
                                {
                                    foo: 'jwt'
                                },
                                {
                                    foo: 'jwt'
                                }
                            >
                        }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<{ foo: 'jwt' }>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                {
                    lambda: z.ZodObject<
                        {
                            foo: z.ZodLiteral<'jwt'>
                        },
                        'strip',
                        z.ZodTypeAny,
                        {
                            foo: 'jwt'
                        },
                        {
                            foo: 'jwt'
                        }
                    >
                }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles authorizer schema types - lambda - true', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    lambda: true,
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        { lambda: true }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<Record<string, unknown>>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                { lambda: true }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles authorizer schema types - iam', () => {
    const handler = restApiHandler({
        http: {
            method,
            path,
            security: {
                foo: [],
                bar: [],
            },
            schema: {
                authorizer: {
                    iam: true,
                },
                responses: {},
            },
            bodyType: 'plaintext',
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    HTTPRequest<
                        undefined,
                        undefined,
                        undefined,
                        undefined,
                        {
                            readonly foo: []
                            readonly bar: []
                        },
                        'rest',
                        { iam: true }
                    >
                >()
                expectTypeOf(request.authorizer).toEqualTypeOf<RestIamAuthorizer>()
                expectTypeOf(request.body).toEqualTypeOf<unknown>()
                expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
                expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
                expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
                expectTypeOf(request.security).toEqualTypeOf<{
                    readonly foo: []
                    readonly bar: []
                }>()
                expectTypeOf(request.raw).toEqualTypeOf<APIGatewayProxyEventSchema>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (
            request: HTTPRequest<
                undefined,
                undefined,
                undefined,
                undefined,
                {
                    readonly foo: []
                    readonly bar: []
                },
                'rest',
                { iam: true }
            >,
        ) => {
            statusCode: 200
            body: '200-response'
        }
    >()
})

it('handles schema types and gives errors', () => {
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>() },
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    statusCode: 200,
                    body: 'not-200-response' as const,
                }
            },
        },
    })
})

it('handles schema types and gives errors on non matching responses', () => {
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 202: literalSchema<'202-response'>() },
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    statusCode: 200,
                    body: '202-response' as const,
                }
            },
        },
    })
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 202: literalSchema<'202-response'>() },
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    statusCode: 202,
                    body: '200-response' as const,
                }
            },
        },
    })
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 202: literalSchema<'202-response'>() },
            },
            handler: () => {
                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 202: literalSchema<'202-response'>() },
            },
            handler: () => {
                return {
                    statusCode: 202,
                    body: '202-response' as const,
                }
            },
        },
    })
})

it('handles no response type and gives errors correctly', () => {
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 204: null },
            },
            handler: () => {
                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 204: null },
            },
            handler: () => {
                return {
                    statusCode: 204,
                }
            },
        },
    })
    restApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>(), 204: null },
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    statusCode: 204,
                    body: '204-response' as const,
                }
            },
        },
    })
})

it('supports Security without a schema', async () => {
    const handler = restApiHandler({
        http: {
            schema: {
                body: z.string(),
                headers: z.object({ foo: z.string() }),
                query: z.object({ bar: z.string() }),
                path: z.object({ baz: z.string() }),
                responses: {},
            },
            // security: {},
            handler: (event, context) => {
                expectTypeOf(event.security).toEqualTypeOf<[]>()
                expectTypeOf(context.services).toEqualTypeOf<never>()
                expectTypeOf(context.profile).toEqualTypeOf<never>()
                expectTypeOf(context.config).toEqualTypeOf<never>()
                return { statusCode: 200, body: '200-response' as const }
            },
        },
    })
    const event = random(restApiEvent(handler))

    const _result = handler.http.handler(event, random(await context(handler)))
})

it('does not handle non http events', async () => {
    const http = vi.fn()
    const handler = restApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext',
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
                // arbitrary(APIGatewayProxyEventSchema),
                // arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
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
    const handler = restApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext',
                handler: http,
            },
        },
        { _kernel: http },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(http).not.toHaveBeenCalled()
})
