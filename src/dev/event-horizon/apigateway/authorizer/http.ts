import type { Dependent } from '@skyleague/axioms'
import { constant, object } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { APIGatewayRequestAuthorizerEventV2Schema } from '../../../../aws/apigateway/http.schema.js'
import type {
    RequestAuthorizerEvent,
    RequestAuthorizerHandler,
    SecuritySchemes,
} from '../../../../events/apigateway/authorizer/types.js'

export function httpApiAuthorizerEvent<
    Configuration,
    Service,
    Profile,
    Path,
    Query,
    Headers,
    Context = never,
    Security extends SecuritySchemes = SecuritySchemes,
>(
    { request }: RequestAuthorizerHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, 'http'>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<RequestAuthorizerEvent<Path, Query, Headers, Security, 'http'>> {
    const headers = request.schema?.headers !== undefined ? arbitrary(request.schema.headers) : constant(undefined)
    const query = request.schema?.query !== undefined ? arbitrary(request.schema.query) : constant(undefined)
    const path = request.schema?.path !== undefined ? arbitrary(request.schema.path) : constant(undefined)
    const raw = arbitrary(APIGatewayRequestAuthorizerEventV2Schema).constant(generation === 'fast')

    return raw.chain((r) => {
        return object({
            headers,
            query,
            path,
            raw: constant(r),
        }).map((event) => {
            // force coercion
            request.schema?.headers?.is?.(event.headers) ?? true
            request.schema?.query?.is?.(event.query) ?? true
            request.schema?.path?.is?.(event.path) ?? true

            event.raw.headers ??= (event.headers as typeof event.raw.headers) ?? {}
            event.raw.queryStringParameters ??= (event.query as typeof event.raw.queryStringParameters) ?? {}

            return {
                ...event,
                security: request.security !== undefined ? request.security : undefined,
                get raw() {
                    return event.raw
                },
            } as RequestAuthorizerEvent<Path, Query, Headers, Security, 'http'>
        })
    })
}
