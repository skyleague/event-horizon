/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { APIGatewayCert, APIGatewayHttpMethod } from './proxy.type.js'
import { validate as APIGatewayEventRequestContextV2Validator } from './schemas/api-gateway-event-request-context-v2.schema.js'
import { validate as APIGatewayProxyEventV2SchemaValidator } from './schemas/api-gateway-proxy-event-v2-schema.schema.js'
import { validate as APIGatewayRequestAuthorizerEventV2SchemaValidator } from './schemas/api-gateway-request-authorizer-event-v2-schema.schema.js'

import type { DefinedError, ValidateFunction } from 'ajv'

export interface APIGatewayEventRequestContextV2 {
    accountId: string
    apiId: string
    authorizer?: RequestContextV2Authorizer
    authentication?:
        | {
              clientCert?: APIGatewayCert | undefined
          }
        | null
        | undefined
    domainName: string
    domainPrefix: string
    http: RequestContextV2Http
    requestId: string
    routeKey: string
    stage: string
    time: string
    timeEpoch: number
}

export const APIGatewayEventRequestContextV2 = {
    validate: APIGatewayEventRequestContextV2Validator as ValidateFunction<APIGatewayEventRequestContextV2>,
    get schema() {
        return APIGatewayEventRequestContextV2.validate.schema
    },
    get errors() {
        return APIGatewayEventRequestContextV2.validate.errors ?? undefined
    },
    is: (o: unknown): o is APIGatewayEventRequestContextV2 => APIGatewayEventRequestContextV2.validate(o) === true,
    parse: (o: unknown): { right: APIGatewayEventRequestContextV2 } | { left: DefinedError[] } => {
        if (APIGatewayEventRequestContextV2.is(o)) {
            return { right: o }
        }
        return { left: (APIGatewayEventRequestContextV2.errors ?? []) as DefinedError[] }
    },
} as const

export interface APIGatewayProxyEventV2Schema {
    version: string
    routeKey: string
    rawPath: string
    rawQueryString: string
    cookies?: string[] | undefined
    headers: {
        [k: string]: string | undefined
    }
    queryStringParameters?:
        | {
              [k: string]: string | undefined
          }
        | undefined
    requestContext: APIGatewayEventRequestContextV2
    body?: string | undefined
    pathParameters?:
        | {
              [k: string]: string | undefined
          }
        | null
        | undefined
    isBase64Encoded: boolean
    stageVariables?:
        | {
              [k: string]: string | undefined
          }
        | null
        | undefined
}

export const APIGatewayProxyEventV2Schema = {
    validate: APIGatewayProxyEventV2SchemaValidator as ValidateFunction<APIGatewayProxyEventV2Schema>,
    get schema() {
        return APIGatewayProxyEventV2Schema.validate.schema
    },
    get errors() {
        return APIGatewayProxyEventV2Schema.validate.errors ?? undefined
    },
    is: (o: unknown): o is APIGatewayProxyEventV2Schema => APIGatewayProxyEventV2Schema.validate(o) === true,
    parse: (o: unknown): { right: APIGatewayProxyEventV2Schema } | { left: DefinedError[] } => {
        if (APIGatewayProxyEventV2Schema.is(o)) {
            return { right: o }
        }
        return { left: (APIGatewayProxyEventV2Schema.errors ?? []) as DefinedError[] }
    },
} as const

export interface APIGatewayRequestAuthorizerEventV2Schema {
    version: '2.0'
    type: 'REQUEST'
    routeArn: string
    identitySource: string[]
    routeKey: string
    rawPath: string
    rawQueryString: string
    cookies?: string[] | undefined
    headers?:
        | {
              [k: string]: string | undefined
          }
        | undefined
    queryStringParameters?:
        | {
              [k: string]: string | undefined
          }
        | undefined
    requestContext: APIGatewayEventRequestContextV2
    pathParameters?:
        | {
              [k: string]: string | undefined
          }
        | null
        | undefined
    stageVariables?:
        | {
              [k: string]: string | undefined
          }
        | null
        | undefined
}

export const APIGatewayRequestAuthorizerEventV2Schema = {
    validate: APIGatewayRequestAuthorizerEventV2SchemaValidator as ValidateFunction<APIGatewayRequestAuthorizerEventV2Schema>,
    get schema() {
        return APIGatewayRequestAuthorizerEventV2Schema.validate.schema
    },
    get errors() {
        return APIGatewayRequestAuthorizerEventV2Schema.validate.errors ?? undefined
    },
    is: (o: unknown): o is APIGatewayRequestAuthorizerEventV2Schema =>
        APIGatewayRequestAuthorizerEventV2Schema.validate(o) === true,
    parse: (o: unknown): { right: APIGatewayRequestAuthorizerEventV2Schema } | { left: DefinedError[] } => {
        if (APIGatewayRequestAuthorizerEventV2Schema.is(o)) {
            return { right: o }
        }
        return { left: (APIGatewayRequestAuthorizerEventV2Schema.errors ?? []) as DefinedError[] }
    },
} as const

export type RequestContextV2Authorizer =
    | {
          jwt?:
              | {
                    claims: {
                        [k: string]: unknown
                    }
                    scopes: string[] | null
                }
              | undefined
          iam?:
              | {
                    accessKey?: string | undefined
                    accountId?: string | undefined
                    callerId?: string | undefined
                    principalOrgId?: string | null | undefined
                    userArn?: string | undefined
                    userId?: string | undefined
                    cognitoIdentity?:
                        | {
                              amr: string[]
                              identityId: string
                              identityPoolId: string
                          }
                        | null
                        | undefined
                }
              | undefined
          lambda?:
              | {
                    [k: string]: unknown
                }
              | null
              | undefined
      }
    | undefined

export interface RequestContextV2Http {
    method: keyof typeof APIGatewayHttpMethod
    path: string
    protocol: string
    sourceIp: string
    userAgent: string
}
