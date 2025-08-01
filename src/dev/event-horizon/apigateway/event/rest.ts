import { APIGatewayProxyEventSchema } from '@aws-lambda-powertools/parser/schemas'
import { constant, type Dependent, object } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { ZodType } from 'zod'
import type { AuthorizerSchema, HTTPHandler, HTTPRequest, Responses } from '../../../../events/apigateway/event/types.js'
import type { SecurityRequirements } from '../../../../events/apigateway/types.js'
import type { InferFromParser, MaybeGenericParser } from '../../../../parsers/types.js'
import { coerce } from '../../coerce.js'

export function restApiEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Body,
    Path,
    Query,
    Headers,
    Result extends Responses,
    Security,
    Authorizer extends AuthorizerSchema<'rest'>,
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
        'rest',
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
        'rest',
        Authorizer
    >
> {
    const { bodyType = 'json' } = http

    const body = http.schema.body !== undefined ? arbitrary(http.schema.body as ZodType) : constant(undefined)
    const headers = http.schema.headers !== undefined ? arbitrary(http.schema.headers as ZodType) : constant(undefined)
    const query = http.schema.query !== undefined ? arbitrary(http.schema.query as ZodType) : constant(undefined)
    const path = http.schema.path !== undefined ? arbitrary(http.schema.path as ZodType) : constant(undefined)
    const raw = arbitrary(APIGatewayProxyEventSchema).constant(generation === 'fast')

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

            if (event.raw.requestContext.eventType !== 'MESSAGE') {
                event.raw.requestContext.messageId = undefined
            }

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
                'rest',
                Authorizer
            >
        })
    })
}
