import type { Config, EventHandlerDefinition, LambdaContext, Services } from '../types'

import type { Promisable, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export type HTTPMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
export type HTTPHeaders = Record<string, string | undefined>
export type HTTPQueryParameters = Record<string, string | undefined>
export type HTTPPathParameters = Record<string, string | undefined>

export interface HTTPRequest<
    B = unknown,
    P = HTTPHeaders | undefined,
    Q = HTTPQueryParameters | undefined,
    H = HTTPPathParameters | undefined,
    GV extends GatewayVersion = 'v1'
> {
    body: B
    headers: H
    query: Q
    path: P
    raw: GV extends 'v1' ? APIGatewayProxyEvent : APIGatewayProxyEventV2
}

export interface HTTPResponse<R = unknown> {
    statusCode: number
    headers?: Record<string, boolean | number | string> | undefined
    body: R
}

export type GatewayVersion = 'v1' | 'v2'

export interface HTTPEventHandler<
    C = never,
    S = never,
    B = unknown,
    P = unknown,
    Q = unknown,
    H = unknown,
    R = unknown,
    GV extends GatewayVersion = 'v1'
> {
    method: HTTPMethod
    path: `/${string}`
    schema: {
        body?: Schema<B>
        path?: Schema<P>
        query?: Schema<Q>
        headers?: Schema<H>
        responses: Record<PropertyKey, Schema<R>>
    }
    handler: (request: HTTPRequest<B, P, Q, H, GV>, context: LambdaContext<C, S>) => Promisable<Try<HTTPResponse<R>>>

    bodyType?: 'binary' | 'json' | 'plaintext'

    gatewayVersion?: GV
}

export interface HTTPHandler<
    C = never,
    S = never,
    HttpB = unknown,
    HttpP = unknown,
    HttpQ = unknown,
    HttpH = unknown,
    HttpR = unknown,
    GV extends GatewayVersion = 'v1'
> extends EventHandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    http: HTTPEventHandler<C, S, HttpB, HttpP, HttpQ, HttpH, HttpR, GV>
}
