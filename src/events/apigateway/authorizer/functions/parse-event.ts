import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import type { APIGatewayRequestAuthorizerEventSchema } from '../../../../aws/apigateway/rest.type.js'
import type { RequestAuthorizerEvent, RequestAuthorizerEventHandler } from '../types.js'

export function authorizerParseEvent<Handler extends RequestAuthorizerEventHandler>(handler: Handler) {
    return {
        before: (
            event: APIGatewayRequestAuthorizerEventV2Schema | APIGatewayRequestAuthorizerEventSchema,
        ): RequestAuthorizerEvent => {
            // headers on the event may be undefined due to test events from the AWS console
            const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([h, v]) => [h.toLowerCase(), v]))

            return {
                headers,
                query: event.queryStringParameters ?? {},
                path: event.pathParameters ?? {},
                security: handler.security ?? {},
                raw: event satisfies RequestAuthorizerEvent['raw'],
            }
        },
    }
}
