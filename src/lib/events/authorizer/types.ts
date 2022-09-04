import type { Config, HandlerDefinition, Services } from '../../types'
import type { LambdaContext } from '../context'

import type { Schema } from '@skyleague/therefore'
import type {
    APIGatewayRequestAuthorizerEvent,
    APIGatewayRequestAuthorizerEventV2,
    APIGatewayTokenAuthorizerEvent,
} from 'aws-lambda'

export type AuthVersion = 'v1' | 'v2'

export type AuthorizerMethod = 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'
export type AuthorizerHeaders = Record<string, string | undefined>
export type AuthorizerQueryParameters = Record<string, string | undefined>
export type AuthorizerPathParameters = Record<string, string | undefined>

export interface RequestAuthorizerRequest<
    B = unknown,
    P = AuthorizerHeaders | undefined,
    Q = AuthorizerQueryParameters | undefined,
    H = AuthorizerPathParameters | undefined,
    AV extends AuthVersion = 'v1'
> {
    body: B
    headers: H
    query: Q
    pathParams: P
    raw: AV extends 'v1' ? APIGatewayRequestAuthorizerEvent : APIGatewayRequestAuthorizerEventV2
}

export interface TokenAuthorizerRequest {
    authorizationToken: string
    methodArn: string
    raw: APIGatewayTokenAuthorizerEvent
}

export interface AuthorizerResponse<R = unknown> {
    statusCode: number
    headers?: Record<string, boolean | number | string> | undefined
    body: R
}

export interface TokenAuthorizerEventHandler<C = never, S = never, R = unknown> {
    handler: (
        request: TokenAuthorizerRequest,
        context: LambdaContext<C, S>
    ) => AuthorizerResponse<R> | Promise<AuthorizerResponse<R>>
}

export interface RequestAuthorizerEventHandler<
    C = never,
    S = never,
    B = unknown,
    P = unknown,
    Q = unknown,
    H = unknown,
    R = unknown,
    AV extends AuthVersion = 'v1'
> {
    schema: {
        body?: Schema<B>
        pathParams?: Schema<P>
        query?: Schema<Q>
        headers?: Schema<H>
        responses: Record<PropertyKey, Schema<R>>
    }
    handler: (
        request: RequestAuthorizerRequest<B, P, Q, H, AV>,
        context: LambdaContext<C, S>
    ) => AuthorizerResponse<R> | Promise<AuthorizerResponse<R>>
}

export interface TokenAuthorizerHandler<C = never, S = never, AuthR = unknown> extends HandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    token: TokenAuthorizerEventHandler<C, S, AuthR>
}

export interface RequestAuthorizerHandler<
    C = never,
    S = never,
    AuthB = unknown,
    AuthP = unknown,
    AuthQ = unknown,
    AuthH = unknown,
    AuthR = unknown,
    GV extends AuthVersion = 'v1'
> extends HandlerDefinition {
    config?: Config<C>
    services?: Services<C, S>
    request: RequestAuthorizerEventHandler<C, S, AuthB, AuthP, AuthQ, AuthH, AuthR, GV>
}

export type AuthorizerHandler<
    C = never,
    S = never,
    AuthB = unknown,
    AuthP = unknown,
    AuthQ = unknown,
    AuthH = unknown,
    AuthR = unknown,
    GV extends AuthVersion = 'v1'
> = RequestAuthorizerHandler<C, S, AuthB, AuthP, AuthQ, AuthH, AuthR, GV> | TokenAuthorizerHandler<C, S, AuthR>
