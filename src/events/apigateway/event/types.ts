import type { Promisable, Try } from '@skyleague/axioms'
import type { IfEmptyObject, Simplify } from '@skyleague/axioms/types'
import type { InferSchemaType, Schema } from '@skyleague/therefore'
import type { APIGatewayProxyEventV2Schema } from '../../../aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'
import type { EventHandlerDefinition, LambdaContext } from '../../types.js'
import type { HTTPHeaders, HTTPMethod, HTTPPathParameters, HTTPQueryParameters, SecurityRequirements } from '../types.js'
import type { HttpError } from './functions/http-error.type.js'

export interface HTTPRequest<
    Body = unknown,
    Path = HTTPPathParameters | undefined,
    Query = HTTPQueryParameters | undefined,
    Headers = HTTPHeaders | undefined,
    Security extends SecurityRequirements = SecurityRequirements,
    GV extends GatewayVersion = 'http' | 'rest',
> {
    body: Body
    headers: Headers
    query: Query
    path: Path
    security: Security
    readonly raw: GV extends 'http' ? APIGatewayProxyEventV2Schema : APIGatewayProxyEventSchema
}

export interface HTTPResponse<Code extends number = number, Result = unknown, Headers = HTTPHeaders> {
    statusCode: Code
    headers?: Headers | undefined
    body: Result
}

export interface HTTPEmptyResponse<Code extends number = number, Headers = HTTPHeaders> {
    statusCode: Code
    headers?: Headers | undefined
    body?: never
}

export type _HTTPResponses<Result extends Responses> = {
    [key in keyof Result]: key extends number
        ? Result[key] extends null
            ? HTTPEmptyResponse<key>
            : HTTPResponse<key, ReponseType<Result[key]>, HeadersType<Result[key]>>
        : never
}[keyof Result]

export type HTTPResponses<Result extends Responses> = Simplify<
    IfEmptyObject<Result, _HTTPResponses<Responses>, _HTTPResponses<Result>>
>
export type GatewayVersion = 'http' | 'rest'

export type ReponseType<Result extends BodyResponse | Response> = InferSchemaType<
    Result extends Response ? Result['body'] : Result
>
export type HeadersType<Result extends BodyResponse | Response> = Result extends Response
    ? // biome-ignore lint/complexity/noBannedTypes: check if headers is defined
      Result['headers'] extends {}
        ? InferSchemaType<Result['headers']>
        : HTTPHeaders
    : HTTPHeaders

export type BodyResponse<T = unknown> = Schema<T> | null
export interface Response<T = unknown, Headers extends HTTPHeaders = HTTPHeaders> {
    body: Schema<T> | null
    headers?: Schema<Headers>
    description?: string
}

export type Responses = { [key: number]: BodyResponse | Response }

export interface HTTPEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Body = unknown,
    Path = HTTPPathParameters,
    Query = HTTPQueryParameters,
    Headers = HTTPHeaders,
    Result extends Responses = Responses,
    Security extends SecurityRequirements = SecurityRequirements,
    GV extends GatewayVersion = 'http' | 'rest',
> {
    method?: HTTPMethod
    path?: `/${string}`
    schema: {
        body?: Schema<Body>
        path?: Schema<Path>
        query?: Schema<Query>
        headers?: Schema<Headers>
        responses: Result
    }
    handler: (
        request: NoInfer<HTTPRequest<Body, Path, Query, Headers, Security, GV>>,
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
    Profile = unknown,
    Body = unknown,
    Path = HTTPPathParameters,
    Query = HTTPQueryParameters,
    Headers = HTTPHeaders,
    Result extends Responses = Responses,
    Security extends SecurityRequirements = SecurityRequirements,
    GV extends GatewayVersion = 'http' | 'rest',
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    http: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV>
    serialize?: {
        error?: ErrorSerializer
    }
}
