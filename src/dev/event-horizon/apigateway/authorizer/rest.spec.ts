import { forAll, isString } from '@skyleague/axioms'
import { it, vi } from 'vitest'
import { APIGatewayRequestAuthorizerEventSchema } from '../../../../aws/apigateway/rest.type.js'
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
