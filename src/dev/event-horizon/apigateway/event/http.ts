import type { Dependent } from '@skyleague/axioms'
import { constant, object } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { APIGatewayProxyEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import type { AuthorizerSchema, HTTPHandler, HTTPRequest, Responses } from '../../../../events/apigateway/event/types.js'
import type { SecurityRequirements } from '../../../../events/apigateway/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../../parsers/types.js'
import { coerce } from '../../coerce.js'

export function httpApiEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Body extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Result extends Responses,
    Security extends SecurityRequirements,
    Authorizer extends AuthorizerSchema<'http'>,
>(
    { http }: HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, 'http', Authorizer>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<
    HTTPRequest<
        InferFromParser<Body, undefined>,
        InferFromParser<Path, undefined>,
        InferFromParser<Query, undefined>,
        InferFromParser<Headers, undefined>,
        Security,
        'http',
        Authorizer
    >
> {
    const { bodyType = 'json' } = http

    const body = http.schema.body !== undefined ? arbitrary(http.schema.body) : constant(undefined)
    const headers = http.schema.headers !== undefined ? arbitrary(http.schema.headers) : constant(undefined)
    const query = http.schema.query !== undefined ? arbitrary(http.schema.query) : constant(undefined)
    const path = http.schema.path !== undefined ? arbitrary(http.schema.path) : constant(undefined)
    const raw = arbitrary(APIGatewayProxyEventV2Schema).constant(generation === 'fast')

    return raw.chain((r) => {
        return object({
            body,
            headers,
            query,
            path,
            raw: constant(r),
        }).map((event) => {
            // force coercion
            event.body = coerce(http.schema.body, event.body)
            event.headers = coerce(http.schema.headers, event.headers)
            event.query = coerce(http.schema.query, event.query)
            event.path = coerce(http.schema.path, event.path)

            if (bodyType !== 'binary') {
                const eventBody = event.body ?? event.raw.body
                const b = (bodyType === 'json' ? JSON.stringify(eventBody ?? '') : eventBody) ?? ''
                event.raw.body = (
                    event.raw.isBase64Encoded === true ? Buffer.from(b.toString()).toString('base64') : b
                ) as typeof event.raw.body
            }

            event.raw.headers ??= (event.headers as typeof event.raw.headers) ?? {}
            event.raw.queryStringParameters ??= (event.query as typeof event.raw.queryStringParameters) ?? {}

            return {
                ...event,
                security: http.security ?? [],
                get raw() {
                    return event.raw
                },
            } as HTTPRequest<
                InferFromParser<Body, undefined>,
                InferFromParser<Path, undefined>,
                InferFromParser<Query, undefined>,
                InferFromParser<Headers, undefined>,
                Security,
                'http',
                Authorizer
            >
        })
    })
}
