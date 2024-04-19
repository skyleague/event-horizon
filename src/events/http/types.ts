import type { HttpError } from './functions/http-error.type.js'

import type { EventHandlerDefinition, LambdaContext } from '../types.js'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export type HTTPMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
export type HTTPHeaders = Record<string, string | undefined>
export type HTTPQueryParameters = Record<string, string | undefined>
export type HTTPPathParameters = Record<string, string | undefined>

export interface HTTPRequest<
    Body = unknown,
    Path = HTTPPathParameters | undefined,
    Query = HTTPQueryParameters | undefined,
    Headers = HTTPHeaders | undefined,
    GV extends GatewayVersion = 'http',
> {
    body: Body
    headers: Headers
    query: Query
    path: Path
    raw: GV extends 'http' ? APIGatewayProxyEvent : APIGatewayProxyEventV2
}

export interface HTTPResponse<Result = unknown> {
    statusCode: number
    headers?: Record<string, boolean | number | string> | undefined
    body: Result
}

export type GatewayVersion = 'http' | 'rest'

export interface HTTPEventHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Body = unknown,
    Path = unknown,
    Query = unknown,
    Headers = unknown,
    Result = unknown,
    GV extends GatewayVersion = 'http',
> {
    method: HTTPMethod
    path: `/${string}`
    schema: {
        body?: Schema<Body>
        path?: Schema<Path>
        query?: Schema<Query>
        headers?: Schema<Headers>
        responses: Record<PropertyKey, Schema<Result>>
    }
    handler: NoInfer<
        (
            request: HTTPRequest<Body, Path, Query, Headers, GV>,
            context: LambdaContext<Configuration, Service, Profile>,
        ) => Promisable<Try<HTTPResponse<Result>>>
    >

    bodyType?: 'binary' | 'json' | 'plaintext'

    gatewayVersion?: GV
}

export type ErrorSerializer<EventErrorType = HttpError> = (error: EventErrorType) => HTTPResponse<HttpError>

export interface HTTPHandler<
    Configuration = unknown,
    Service = unknown,
    Profile = unknown,
    Body = unknown,
    Path = unknown,
    Query = unknown,
    Headers = unknown,
    Result = unknown,
    GV extends GatewayVersion = 'http',
> extends EventHandlerDefinition<Configuration, Service, Profile> {
    http: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>
    serialize?: {
        error?: ErrorSerializer
    }
}
