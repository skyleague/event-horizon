import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import type { APIGatewayRequestAuthorizerEventSchema } from '../../../../aws/apigateway/rest.type.js'
import type { MaybeGenericParser } from '../../../../parsers/types.js'
import type { GatewayVersion } from '../../event/types.js'
import type { RequestAuthorizerEvent, RequestAuthorizerEventHandler, SecuritySchemes } from '../types.js'

export function authorizerParseEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Context extends MaybeGenericParser,
    Security extends SecuritySchemes | undefined,
    GV extends GatewayVersion,
>(handler: RequestAuthorizerEventHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>) {
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
