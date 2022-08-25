import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export type HttpMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
export type HttpHeaders = Record<string, string | undefined>
export type HttpQueryParameters = Record<string, string | undefined>
export type HttpPathParameters = Record<string, string | undefined>

export interface HttpRequest<
    B = unknown,
    P = HttpHeaders | undefined,
    Q = HttpQueryParameters | undefined,
    H = HttpPathParameters | undefined,
    GV extends GatewayVersion = 'v1'
> {
    body: B
    headers: H
    query: Q
    path: P
    raw: GV extends 'v1' ? APIGatewayProxyEvent : APIGatewayProxyEventV2
}

export interface HttpResponse<R = unknown> {
    statusCode: number
    headers?: Record<string, boolean | number | string> | undefined
    body: R
}

export type GatewayVersion = 'v1' | 'v2'

export interface HttpEventHandler<
    B = unknown,
    P = unknown,
    Q = unknown,
    H = unknown,
    R = unknown,
    GV extends GatewayVersion = 'v1'
> {
    method: HttpMethod
    url: string
    schema: {
        body?: Schema<B>
        path?: Schema<P>
        query?: Schema<Q>
        headers?: Schema<H>
        responses: Record<PropertyKey, Schema<R>>
    }
    handler: (request: HttpRequest<B, P, Q, H, GV>, context: LambdaContext) => HttpResponse<R> | Promise<HttpResponse<R>>

    bodyType?: 'binary' | 'json' | 'plaintext'

    gatewayVersion?: GV
}
