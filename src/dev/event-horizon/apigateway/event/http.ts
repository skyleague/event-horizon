import type { Dependent } from '@skyleague/axioms'
import { constant, object } from '@skyleague/axioms'
import { type Schema, arbitrary } from '@skyleague/therefore'
import { APIGatewayProxyEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import type { AuthorizerSchema, HTTPHandler, HTTPRequest, Responses } from '../../../../events/apigateway/event/types.js'
import type { SecurityRequirements } from '../../../../events/apigateway/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../../parsers/types.js'
import { coerce } from '../../coerce.js'

export function httpApiEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Body,
    Path,
    Query,
    Headers,
    Result extends Responses,
    Security,
    Authorizer extends AuthorizerSchema<'http'>,
>(
    {
        http,
    }: HTTPHandler<
        Configuration,
        Service,
        Profile,
        Body extends MaybeGenericParser ? Body : undefined,
        Path extends MaybeGenericParser ? Path : undefined,
        Query extends MaybeGenericParser ? Query : undefined,
        Headers extends MaybeGenericParser ? Headers : undefined,
        Result,
        Security extends SecurityRequirements | undefined ? Security : undefined,
        'http',
        Authorizer
    >,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<
    HTTPRequest<
        InferFromParser<Body extends MaybeGenericParser ? Body : undefined, undefined>,
        InferFromParser<Path extends MaybeGenericParser ? Path : undefined, undefined>,
        InferFromParser<Query extends MaybeGenericParser ? Query : undefined, undefined>,
        InferFromParser<Headers extends MaybeGenericParser ? Headers : undefined, undefined>,
        Security extends SecurityRequirements | undefined ? Security : undefined,
        'http',
        Authorizer
    >
> {
    const { bodyType = 'json' } = http

    const body = http.schema.body !== undefined ? arbitrary(http.schema.body as Schema<unknown>) : constant(undefined)
    const headers = http.schema.headers !== undefined ? arbitrary(http.schema.headers as Schema<unknown>) : constant(undefined)
    const query = http.schema.query !== undefined ? arbitrary(http.schema.query as Schema<unknown>) : constant(undefined)
    const path = http.schema.path !== undefined ? arbitrary(http.schema.path as Schema<unknown>) : constant(undefined)
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
            event.body = coerce(http.schema.body, event.body) as typeof event.body
            event.headers = coerce(http.schema.headers, event.headers) as typeof event.headers
            event.query = coerce(http.schema.query, event.query) as typeof event.query
            event.path = coerce(http.schema.path, event.path) as typeof event.path

            if (bodyType !== 'binary') {
                const eventBody = event.body ?? event.raw.body
                const b = (bodyType === 'json' ? JSON.stringify(eventBody ?? '') : eventBody) ?? ''
                event.raw.body = (
                    event.raw.isBase64Encoded === true ? Buffer.from(b.toString()).toString('base64') : b
                ) as typeof event.raw.body
            }

            event.raw.headers = (event.headers as typeof event.raw.headers) ?? {}
            event.raw.queryStringParameters = (event.query as typeof event.raw.queryStringParameters) ?? {}
            event.raw.pathParameters = (event.path as typeof event.raw.pathParameters) ?? {}

            return {
                ...event,
                security: http.security ?? [],
                get raw() {
                    return event.raw
                },
            } as HTTPRequest<
                InferFromParser<Body extends MaybeGenericParser ? Body : undefined, undefined>,
                InferFromParser<Path extends MaybeGenericParser ? Path : undefined, undefined>,
                InferFromParser<Query extends MaybeGenericParser ? Query : undefined, undefined>,
                InferFromParser<Headers extends MaybeGenericParser ? Headers : undefined, undefined>,
                Security extends SecurityRequirements | undefined ? Security : undefined,
                'http',
                Authorizer
            >
        })
    })
}
