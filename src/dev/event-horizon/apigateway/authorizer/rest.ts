import type { Dependent } from '@skyleague/axioms'
import { constant, object } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { APIGatewayRequestAuthorizerEventSchema } from '../../../../aws/apigateway/rest.type.js'
import type {
    RequestAuthorizerEvent,
    RequestAuthorizerHandler,
    SecuritySchemes,
} from '../../../../events/apigateway/authorizer/types.js'
import type { MaybeGenericParser } from '../../../../parsers/types.js'
import { coerce } from '../../coerce.js'

export function restApiAuthorizerEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Context extends MaybeGenericParser,
    Security extends SecuritySchemes = SecuritySchemes,
>(
    { request }: RequestAuthorizerHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, 'rest'>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<RequestAuthorizerEvent<Path, Query, Headers, Security, 'rest'>> {
    const headers = request.schema?.headers !== undefined ? arbitrary(request.schema.headers) : constant(undefined)
    const query = request.schema?.query !== undefined ? arbitrary(request.schema.query) : constant(undefined)
    const path = request.schema?.path !== undefined ? arbitrary(request.schema.path) : constant(undefined)
    const raw = arbitrary(APIGatewayRequestAuthorizerEventSchema).constant(generation === 'fast')

    return raw.chain((r) => {
        return object({
            headers,
            query,
            path,
            raw: constant(r),
        }).map((event) => {
            // force coercion
            event.headers = coerce(request.schema?.headers, event.headers)
            event.query = coerce(request.schema?.query, event.query)
            event.path = coerce(request.schema?.path, event.path)

            event.raw.headers ??= (event.headers as typeof event.raw.headers) ?? {}
            event.raw.queryStringParameters ??= (event.query as typeof event.raw.queryStringParameters) ?? {}
            event.raw.pathParameters ??= (event.path as typeof event.raw.pathParameters) ?? {}

            return {
                ...event,
                security: request.security !== undefined ? request.security : undefined,
                get raw() {
                    return event.raw
                },
            } as RequestAuthorizerEvent<Path, Query, Headers, Security, 'rest'>
        })
    })
}
