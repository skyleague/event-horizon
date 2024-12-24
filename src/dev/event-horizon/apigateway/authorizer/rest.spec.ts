import { forAll, isString, tuple } from '@skyleague/axioms'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { APIGatewayRequestAuthorizerEventSchema } from '../../../../aws/apigateway/rest.type.js'
import { restApiAuthorizer } from '../../../../events/apigateway/authorizer/http.js'
import type { HTTPHeaders, HTTPPathParameters, HTTPQueryParameters } from '../../../../events/apigateway/types.js'
import { context } from '../../../../test/context/context.js'
import { restApiAuthorizerEvent } from './rest.js'

it('restApiAuthorizerEvent === restApiAuthorizerEvent', () => {
    forAll(restApiAuthorizerEvent({ request: { handler: vi.fn(), schema: {} } }), (e) =>
        APIGatewayRequestAuthorizerEventSchema.is(e.raw),
    )
})

it('restApiAuthorizerEvent headers === headers', () => {
    forAll(
        restApiAuthorizerEvent({
            request: {
                handler: vi.fn(),
                schema: { headers: { schema: { type: 'string' } } as any },
            },
        }),
        (e) => isString(e.headers),
    )
})

it('should properly validate and type event payload', () => {
    forAll(
        restApiAuthorizerEvent(
            restApiAuthorizer({
                request: {
                    schema: {
                        path: z.literal('path'),
                        query: z.literal('query'),
                        headers: z.literal('headers'),
                        context: z.literal('context'),
                    },
                    handler: ({ path, query, headers }) => {
                        expectTypeOf(path).toEqualTypeOf<'path'>()
                        expectTypeOf(query).toEqualTypeOf<'query'>()
                        expectTypeOf(headers).toEqualTypeOf<'headers'>()

                        return {
                            isAuthorized: true,
                            context: 'context' as const,
                        }
                    },
                },
            }),
        ),
        (request) => {
            expect(request.path).toEqual('path')
            expect(request.query).toEqual('query')
            expect(request.headers).toEqual('headers')

            // expect(request.raw.body).toEqual(request.body)
            expect(request.raw.pathParameters).toEqual(request.path)
            expect(request.raw.queryStringParameters).toEqual(request.query)
            expect(request.raw.headers).toEqual(request.headers)

            expectTypeOf(request.path).toEqualTypeOf<'path'>()
            expectTypeOf(request.query).toEqualTypeOf<'query'>()
            expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
        },
    )
})

it('default parameter types', async () => {
    const handler = restApiAuthorizer({
        request: {
            schema: {},
            handler: (_event, _ctx) => {
                return {
                    isAuthorized: true,
                    context: 'context' as const,
                }
            },
        },
    })
    forAll(tuple(restApiAuthorizerEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.request.handler(request, ctx)).toEqualTypeOf<{
            isAuthorized: true
            context: 'context'
        }>()

        expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
        expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
        expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
        expectTypeOf(request.security).toEqualTypeOf<[]>()
    })
})

it('default parameter return types', async () => {
    const handler = restApiAuthorizer({
        request: {
            schema: {},
            handler: (_event, _ctx) => {
                return {
                    isAuthorized: true,
                }
            },
        },
    })
    forAll(tuple(restApiAuthorizerEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.request.handler(request, ctx)).toEqualTypeOf<{
            isAuthorized: true
        }>()

        expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
        expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
        expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
        expectTypeOf(request.security).toEqualTypeOf<[]>()
    })
})
