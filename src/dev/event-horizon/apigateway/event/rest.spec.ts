import { APIGatewayProxyEventSchema } from '@aws-lambda-powertools/parser/schemas'
import { forAll, isString, tuple } from '@skyleague/axioms'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { restApiHandler } from '../../../../events/apigateway/event/http.js'
import type { HTTPHeaders, HTTPPathParameters, HTTPQueryParameters } from '../../../../events/apigateway/types.js'
import { context } from '../../../../test/context/context.js'
import { restApiEvent } from './rest.js'

it('restApiEvent === restApiEvent', () => {
    forAll(restApiEvent({ http: { method: 'get', path: '/', handler: vi.fn() as any, schema: { responses: {} } } }), (e) => {
        APIGatewayProxyEventSchema.parse(e.raw)
    })
})

it('restApiEvent body === body', () => {
    forAll(
        restApiEvent({
            http: {
                method: 'get',
                path: '/',
                handler: vi.fn() as any,
                schema: { body: { schema: { type: 'string' } } as any, responses: {} },
            },
        }),
        (e) => isString(e.body),
    )
})

it('should properly validate and type event payload', () => {
    forAll(
        restApiEvent(
            restApiHandler({
                http: {
                    schema: {
                        path: z.literal('path'),
                        body: z.literal('payload'),
                        query: z.literal('query'),
                        headers: z.literal('headers'),
                        responses: { 200: z.literal('result') },
                    },
                    handler: ({ body, path, query, headers }) => {
                        expectTypeOf(path).toEqualTypeOf<'path'>()
                        expectTypeOf(body).toEqualTypeOf<'payload'>()
                        expectTypeOf(query).toEqualTypeOf<'query'>()
                        expectTypeOf(headers).toEqualTypeOf<'headers'>()

                        return { statusCode: 200, body: 'result' as const }
                    },
                },
            }),
        ),
        (request) => {
            expect(request.body).toEqual('payload')
            expect(request.path).toEqual('path')
            expect(request.query).toEqual('query')
            expect(request.headers).toEqual('headers')

            // expect(request.raw.body).toEqual(request.body)
            expect(request.raw.pathParameters).toEqual(request.path)
            expect(request.raw.queryStringParameters).toEqual(request.query)
            expect(request.raw.headers).toEqual(request.headers)

            expectTypeOf(request.body).toEqualTypeOf<'payload'>()
            expectTypeOf(request.path).toEqualTypeOf<'path'>()
            expectTypeOf(request.query).toEqualTypeOf<'query'>()
            expectTypeOf(request.headers).toEqualTypeOf<'headers'>()
            expectTypeOf(request.security).toEqualTypeOf<[]>()
        },
    )
})

it('default parameter types', async () => {
    const handler = restApiHandler({
        http: {
            schema: {
                responses: {
                    200: z.literal('response'),
                },
            },
            handler: (_event, _ctx) => {
                return {
                    statusCode: 200,
                    body: 'response' as const,
                }
            },
        },
    })
    forAll(tuple(restApiEvent(handler), await context(handler)), ([request, ctx]) => {
        expectTypeOf(handler.http.handler(request, ctx)).toEqualTypeOf<{
            statusCode: 200
            body: 'response'
        }>()

        expectTypeOf(request.body).toEqualTypeOf<unknown>()
        expectTypeOf(request.path).toEqualTypeOf<HTTPPathParameters>()
        expectTypeOf(request.query).toEqualTypeOf<HTTPQueryParameters>()
        expectTypeOf(request.headers).toEqualTypeOf<HTTPHeaders>()
        expectTypeOf(request.security).toEqualTypeOf<[]>()
    })
})
