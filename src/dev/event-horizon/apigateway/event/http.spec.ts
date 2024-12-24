import { forAll, isString } from '@skyleague/axioms'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { z } from 'zod'
import { APIGatewayProxyEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import { httpApiHandler } from '../../../../events/apigateway/event/http.js'
import { httpApiEvent } from './http.js'

it('httpApiEvent === httpApiEvent', () => {
    forAll(httpApiEvent({ http: { method: 'get', path: '/', handler: vi.fn(), schema: { responses: {} } } }), (e) =>
        APIGatewayProxyEventV2Schema.is(e.raw),
    )
})

it('httpApiEvent body === body', () => {
    forAll(
        httpApiEvent({
            http: {
                method: 'get',
                path: '/',
                handler: vi.fn(),
                schema: { body: { schema: { type: 'string' } } as any, responses: {} },
            },
        }),
        (e) => isString(e.body),
    )
})

it('should properly validate and type event payload', () => {
    forAll(
        httpApiEvent(
            httpApiHandler({
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
        },
    )
})
