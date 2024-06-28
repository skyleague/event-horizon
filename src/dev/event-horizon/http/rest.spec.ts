import { restApiEvent } from './rest.js'

import { forAll, isString } from '@skyleague/axioms'
import { it, vi } from 'vitest'
import { APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'

it('restApiEvent === restApiEvent', () => {
    forAll(restApiEvent({ http: { method: 'get', path: '/', handler: vi.fn(), schema: { responses: {} } } }), (e) =>
        APIGatewayProxyEventSchema.is(e.raw),
    )
})

it('restApiEvent body === body', () => {
    forAll(
        restApiEvent({
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
