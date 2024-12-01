import type { Promisable, Try } from '@skyleague/axioms'
import type { IfEmptyObject, IsNever, Simplify } from '@skyleague/axioms/types'
import type { APIGatewayProxyEventV2Schema, RequestContextV2Authorizer } from '../../../aws/apigateway/http.type.js'
import type { APIGatewayEventRequestContext, APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'
import type { GenericParser, InferFromParser, MaybeGenericParser } from '../../../parsers/types.js'
import type { EventHandlerDefinition, LambdaContext } from '../../types.js'
import type { HTTPHeaders, HTTPMethod, HTTPPathParameters, HTTPQueryParameters, SecurityRequirements } from '../types.js'
import type { HttpError } from './functions/http-error.type.js'

export type GatewayVersion = 'http' | 'rest'

export type AuthorizerSchema<GV extends GatewayVersion> = GV extends 'http'
    ? { lambda: GenericParser | true } | { iam?: true }
    : { jwt: GenericParser | true } | { lambda: GenericParser | true } | { iam?: true }

export type AuthorizerContext<GV extends GatewayVersion, Authorizer extends AuthorizerSchema<GV>> = Authorizer extends {
    jwt: true
}
    ? {
          claims: Record<string, unknown>
          scopes: string[]
      }
    : Authorizer extends { jwt: infer AuthorizerContextParser extends MaybeGenericParser }
      ? {
            claims: InferFromParser<AuthorizerContextParser>
            scopes: string[]
        }
      : Authorizer extends { lambda: true }
        ? Record<string, unknown>
        : Authorizer extends { lambda: infer AuthorizerContextParser extends MaybeGenericParser }
          ? InferFromParser<AuthorizerContextParser>
          : Authorizer extends { iam: true }
            ? GV extends 'http'
                ? HTTPIamAuthorizer
                : RestIamAuthorizer
            : AnyAuthorizerContext<GV>

export type AnyAuthorizerContext<GV> = GV extends 'http'
    ? AuthorizerContext<'http', { lambda: true }> | AuthorizerContext<'http', { iam: true }>
    :
          | AuthorizerContext<'rest', { jwt: true }>
          | AuthorizerContext<'rest', { lambda: true }>
          | AuthorizerContext<'http', { iam: true }>

export type HTTPIamAuthorizer = Exclude<Exclude<RequestContextV2Authorizer, undefined>['iam'], undefined>
export type RestIamAuthorizer = Extract<
    Exclude<APIGatewayEventRequestContext['authorizer'], undefined | null>,
    { principalId: string }
>

export interface HTTPRequest<
    Body = undefined,
    Path = undefined,
    Query = undefined,
    Headers = undefined,
    Security extends SecurityRequirements | undefined = SecurityRequirements | undefined,
    GV extends GatewayVersion = 'http' | 'rest',
    Authorizer extends AuthorizerSchema<GV> = AuthorizerSchema<GV>,
> {
    body: [Body] extends [undefined] ? unknown : Body
    headers: [Headers] extends [undefined] ? HTTPHeaders : Headers
    query: [Query] extends [undefined] ? HTTPQueryParameters : Query
    path: [Path] extends [undefined] ? HTTPPathParameters : Path
    security: [Security] extends [undefined] ? [] : Security
    authorizer: AuthorizerContext<GV, Authorizer>
    readonly raw: GV extends 'http' ? APIGatewayProxyEventV2Schema : APIGatewayProxyEventSchema
}

export type HTTPResponse<Code extends number = number, Result = unknown, Headers = undefined> = Simplify<
    {
        statusCode: Code
    } & (IsNever<Headers> extends true
        ? { headers?: never }
        : Headers extends undefined
          ? { headers?: HTTPHeaders }
          : { headers: Headers }) &
        (IsNever<Result> extends true ? { body?: never } : { body: Result })
>

export type BodyOnlyResponse = GenericParser | null
export interface FullResponse<
    Body extends MaybeGenericParser = MaybeGenericParser,
    Headers extends MaybeGenericParser = MaybeGenericParser,
> {
    body: Body | null
    headers?: Headers
    description?: string
}

export type Responses = { [key: number]: BodyOnlyResponse | FullResponse }

export type _HTTPResponses<Result extends Responses> = {
    [Code in keyof Result]: Code extends number
        ? Result[Code] extends null
            ? HTTPResponse<Code, never>
            : Result[Code] extends { body: GenericParser | null }
              ? HTTPResponse<
                    Code,
                    Result[Code] extends { body: GenericParser } ? InferFromParser<Result[Code]['body']> : never,
                    Result[Code] extends { headers: GenericParser } ? InferFromParser<Result[Code]['headers']> : undefined
                >
              : Result[Code] extends GenericParser
                ? HTTPResponse<Code, InferFromParser<Result[Code]>, undefined>
                : HTTPResponse<Code, never, undefined>
        : never
}[keyof Result]

export type HTTPResponses<Result extends Responses> = Simplify<
    IfEmptyObject<Result, HTTPResponse<number>, _HTTPResponses<Result>>
>

export interface HTTPEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Body extends MaybeGenericParser = MaybeGenericParser,
    Path extends MaybeGenericParser = MaybeGenericParser,
    Query extends MaybeGenericParser = MaybeGenericParser,
    Headers extends MaybeGenericParser = MaybeGenericParser,
    Result extends Responses = Responses,
    Security extends SecurityRequirements | undefined = SecurityRequirements | undefined,
    GV extends GatewayVersion = 'http' | 'rest',
    Authorizer extends AuthorizerSchema<GV> = AuthorizerSchema<GV>,
> {
    method?: HTTPMethod
    path?: `/${string}`
    schema: {
        body?: Body
        path?: Path
        query?: Query
        headers?: Headers
        authorizer?: Authorizer
        responses: Result
    }
    handler: (
        request: NoInfer<
            HTTPRequest<
                InferFromParser<Body, undefined>,
                InferFromParser<Path, undefined>,
                InferFromParser<Query, undefined>,
                InferFromParser<Headers, undefined>,
                Security,
                GV,
                Authorizer
            >
        >,
        context: LambdaContext<Configuration, Service, Profile>,
    ) => Promisable<Try<HTTPResponses<NoInfer<Result>>>>
    security?: Security
    bodyType?: 'binary' | 'json' | 'plaintext'
}

export type ErrorSerializer<Code extends number = number, EventErrorType = HttpError> = (
    error: EventErrorType,
) => HTTPResponse<Code, HttpError>

export interface HTTPHandler<
    Configuration = unknown,
    Service = unknown,
    Profile extends MaybeGenericParser = MaybeGenericParser,
    Body extends MaybeGenericParser = MaybeGenericParser,
    Path extends MaybeGenericParser = MaybeGenericParser,
    Query extends MaybeGenericParser = MaybeGenericParser,
    Headers extends MaybeGenericParser = MaybeGenericParser,
    Result extends Responses = Responses,
    Security extends SecurityRequirements | undefined = SecurityRequirements | undefined,
    GV extends GatewayVersion = 'http' | 'rest',
    Authorizer extends AuthorizerSchema<GV> = AuthorizerSchema<GV>,
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    http: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV, Authorizer>
    serialize?: {
        error?: ErrorSerializer
    }
}
