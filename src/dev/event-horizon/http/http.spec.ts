import { forAll, isString } from '@skyleague/axioms'
import { it, vi } from 'vitest'
import { APIGatewayProxyEventV2Schema } from '../../aws/apigateway/http.type.js'
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
