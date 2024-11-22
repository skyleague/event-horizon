import { type Try, isDefined, isString } from '@skyleague/axioms'
import type { APIGatewayProxyEventV2Schema } from '../../../../aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../../../aws/apigateway/rest.type.js'
import { EventError } from '../../../../errors/event-error/event-error.js'
import { parseJSON } from '../../../../parsers/json/json.js'
import type { SecurityRequirements } from '../../types.js'
import type {
    AnyAuthorizerContext,
    AuthorizerSchema,
    GatewayVersion,
    HTTPEventHandler,
    HTTPRequest,
    Responses,
} from '../types.js'

export function httpParseEvent<
    Configuration,
    Service,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result extends Responses,
    Security extends SecurityRequirements,
    GV extends GatewayVersion,
    Authorizer extends AuthorizerSchema<GV>,
>({
    bodyType = 'json',
    schema,
    security,
}: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV, Authorizer>) {
    return {
        authorization: (event: APIGatewayProxyEventV2Schema | APIGatewayProxyEventSchema): Try<AnyAuthorizerContext<GV>> => {
            if (schema.authorizer !== undefined) {
                if ('jwt' in schema.authorizer) {
                    if (isDefined(event.requestContext.authorizer) && 'claims' in event.requestContext.authorizer) {
                        return {
                            ...event.requestContext.authorizer,
                            scopes: event.requestContext.authorizer.scopes ?? [],
                        } as AnyAuthorizerContext<GV>
                    }
                    if (
                        isDefined(event.requestContext.authorizer) &&
                        'jwt' in event.requestContext.authorizer &&
                        isDefined(event.requestContext.authorizer.jwt)
                    ) {
                        return {
                            ...event.requestContext.authorizer.jwt,
                            scopes: event.requestContext.authorizer.jwt.scopes ?? [],
                        } as AnyAuthorizerContext<GV>
                    }
                    return EventError.badRequest('Expected request to be authorized using JWT')
                }

                if ('lambda' in schema.authorizer) {
                    if (isDefined(event.requestContext.authorizer) && 'principalId' in event.requestContext.authorizer) {
                        return event.requestContext.authorizer as AnyAuthorizerContext<GV>
                    }
                    if (
                        isDefined(event.requestContext.authorizer) &&
                        'lambda' in event.requestContext.authorizer &&
                        isDefined(event.requestContext.authorizer.lambda)
                    ) {
                        return event.requestContext.authorizer
                            .lambda satisfies AnyAuthorizerContext<'http'> as AnyAuthorizerContext<GV>
                    }
                    return EventError.badRequest('Expected request to be authorized using Lambda')
                }

                if ('iam' in schema.authorizer) {
                    if (
                        isDefined(event.requestContext.authorizer) &&
                        'iam' in event.requestContext.authorizer &&
                        isDefined(event.requestContext.authorizer.iam)
                    ) {
                        return event.requestContext.authorizer
                            .iam satisfies AnyAuthorizerContext<'http'> as AnyAuthorizerContext<GV>
                    }
                    return EventError.badRequest('Expected request to be authorized using IAM')
                }
            }
            return undefined as never
        },
        before: (
            event: APIGatewayProxyEventV2Schema | APIGatewayProxyEventSchema,
            authorizer: AnyAuthorizerContext<GV>,
        ): Try<HTTPRequest> => {
            let body: unknown = event.body
            if (bodyType !== 'binary' && isString(event.body)) {
                const unencodedBody = event.isBase64Encoded === true ? Buffer.from(event.body, 'base64').toString() : event.body
                body = bodyType === 'json' ? parseJSON(unencodedBody) : unencodedBody
            }
            // headers on the event may be undefined due to test events from the AWS console
            const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([h, v]) => [h.toLowerCase(), v]))

            return {
                body,
                headers,
                query: event.queryStringParameters ?? {},
                path: event.pathParameters ?? {},
                security: security ?? [],
                authorizer: authorizer as HTTPRequest['authorizer'],
                raw: event satisfies HTTPRequest['raw'],
            }
        },
    }
}
