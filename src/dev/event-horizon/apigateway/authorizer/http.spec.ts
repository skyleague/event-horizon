import { forAll, isString } from '@skyleague/axioms'
import { it, vi } from 'vitest'
import { APIGatewayRequestAuthorizerEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import { httpApiAuthorizerEvent } from './http.js'

it('httpApiAuthorizerEvent === httpApiAuthorizerEvent', () => {
    forAll(httpApiAuthorizerEvent({ request: { handler: vi.fn(), schema: {} } }), (e) =>
        APIGatewayRequestAuthorizerEventV2Schema.is(e.raw),
    )
})

it('rApiAuthorizerEvent headers === headers', () => {
    forAll(
        httpApiAuthorizerEvent({
            request: {
                handler: vi.fn(),
                schema: { headers: { schema: { type: 'string' } } as any },
            },
        }),
        (e) => isString(e.headers),
    )
})
