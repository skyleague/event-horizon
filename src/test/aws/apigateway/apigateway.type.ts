/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as APIGatewayProxyEventValidator } from './schemas/api-gateway-proxy-event.schema.js'

export interface APIGatewayEventClientCertificate {
    clientCertPem: string
    serialNumber: string
    subjectDN: string
    issuerDN: string
    validity: {
        notAfter: string
        notBefore: string
    }
}

export type APIGatewayEventDefaultAuthorizerContext =
    | null
    | {
          [k: string]: unknown
      }
    | undefined

export interface APIGatewayEventIdentity {
    accessKey: string | null
    accountId: string | null
    apiKey: string | null
    apiKeyId: string | null
    caller: string | null
    clientCert: APIGatewayEventClientCertificate | null
    cognitoAuthenticationProvider: string | null
    cognitoAuthenticationType: string | null
    cognitoIdentityId: string | null
    cognitoIdentityPoolId: string | null
    principalOrgId: string | null
    sourceIp: string
    user: string | null
    userAgent: string | null
    userArn: string | null
}

export interface APIGatewayProxyEvent {
    body: string | null
    headers: APIGatewayProxyEventHeaders
    multiValueHeaders: APIGatewayProxyEventMultiValueHeaders
    httpMethod: string
    isBase64Encoded: boolean
    path: string
    pathParameters: APIGatewayProxyEventPathParameters | null
    queryStringParameters: APIGatewayProxyEventQueryStringParameters | null
    multiValueQueryStringParameters: APIGatewayProxyEventMultiValueQueryStringParameters | null
    stageVariables: APIGatewayProxyEventStageVariables | null
    requestContext: {
        accountId: string
        apiId: string
        authorizer:
            | null
            | {
                  [k: string]: unknown
              }
            | undefined
        connectedAt?: number | undefined
        connectionId?: string | undefined
        domainName?: string | undefined
        domainPrefix?: string | undefined
        eventType?: string | undefined
        extendedRequestId?: string | undefined
        protocol: string
        httpMethod: string
        identity: APIGatewayEventIdentity
        messageDirection?: string | undefined
        messageId?: (string | null) | undefined
        path: string
        stage: string
        requestId: string
        requestTime?: string | undefined
        requestTimeEpoch: number
        resourceId: string
        resourcePath: string
        routeKey?: string | undefined
    }
    resource: string
}

export const APIGatewayProxyEvent = {
    validate: APIGatewayProxyEventValidator as ValidateFunction<APIGatewayProxyEvent>,
    get schema() {
        return APIGatewayProxyEvent.validate.schema
    },
    get errors() {
        return APIGatewayProxyEvent.validate.errors ?? undefined
    },
    is: (o: unknown): o is APIGatewayProxyEvent => APIGatewayProxyEvent.validate(o) === true,
    parse: (o: unknown): { right: APIGatewayProxyEvent } | { left: DefinedError[] } => {
        if (APIGatewayProxyEvent.is(o)) {
            return { right: o }
        }
        return { left: (APIGatewayProxyEvent.errors ?? []) as DefinedError[] }
    },
} as const

export interface APIGatewayProxyEventHeaders {
    [k: string]: string | undefined
}

export interface APIGatewayProxyEventMultiValueHeaders {
    [k: string]: string[] | undefined
}

export interface APIGatewayProxyEventMultiValueQueryStringParameters {
    [k: string]: string[] | undefined
}

export interface APIGatewayProxyEventPathParameters {
    [k: string]: string | undefined
}

export interface APIGatewayProxyEventQueryStringParameters {
    [k: string]: string | undefined
}

export interface APIGatewayProxyEventStageVariables {
    [k: string]: string | undefined
}
