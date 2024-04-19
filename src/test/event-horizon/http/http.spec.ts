import { httpEvent } from './http.js'

import { APIGatewayProxyEvent } from '../../aws/apigateway/apigateway.type.js'

import { forAll, isString } from '@skyleague/axioms'
import { it, vi } from 'vitest'

it('httpEvent === httpEvent', () => {
    forAll(httpEvent({ http: { method: 'get', path: '/', handler: vi.fn(), schema: { responses: {} } } }), (e) =>
        APIGatewayProxyEvent.assert(e.raw)
    )
})

it('httpEvent body === body', () => {
    forAll(
        httpEvent({
            http: {
                method: 'get',
                path: '/',
                handler: vi.fn(),
                schema: { body: { schema: { type: 'string' } } as any, responses: {} },
            },
        }),
        (e) => isString(e.body)
    )
})
