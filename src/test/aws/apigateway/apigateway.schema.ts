import {
    $array,
    $boolean,
    $const,
    $integer,
    $null,
    $object,
    $optional,
    $record,
    $ref,
    $string,
    $union,
    $unknown,
    $validator,
} from '@skyleague/therefore'
import type { ThereforeSchema } from '@skyleague/therefore/src/lib/primitives/types.js'

export const APIGatewayProxyEventHeaders = $record($string)
export const APIGatewayProxyEventMultiValueHeaders = $record($array($string))
export const APIGatewayProxyEventPathParameters = $record($string)
export const APIGatewayProxyEventQueryStringParameters = $record($string)
export const APIGatewayProxyEventMultiValueQueryStringParameters = $record($array($string))
export const APIGatewayProxyEventStageVariables = $record($string)

export const APIGatewayEventDefaultAuthorizerContext = $union([$null, $record($unknown), $const(undefined)])

export const APIGatewayEventClientCertificate = $object({
    clientCertPem: $string,
    serialNumber: $string,
    subjectDN: $string,
    issuerDN: $string,
    validity: $object({
        notAfter: $string,
        notBefore: $string,
    }),
})

export const APIGatewayEventIdentity = $object({
    accessKey: $union([$string, $null]),
    accountId: $union([$string, $null]),
    apiKey: $union([$string, $null]),
    apiKeyId: $union([$string, $null]),
    caller: $union([$string, $null]),
    clientCert: $union([$ref(APIGatewayEventClientCertificate), $null]),
    cognitoAuthenticationProvider: $union([$string, $null]),
    cognitoAuthenticationType: $union([$string, $null]),
    cognitoIdentityId: $union([$string, $null]),
    cognitoIdentityPoolId: $union([$string, $null]),
    principalOrgId: $union([$string, $null]),
    sourceIp: $string,
    user: $union([$string, $null]),
    userAgent: $union([$string, $null]),
    userArn: $union([$string, $null]),
})

export const APIGatewayEventRequestContextWithAuthorizer = (context: ThereforeSchema) =>
    $object({
        accountId: $string,
        apiId: $string,
        authorizer: context,
        connectedAt: $optional($integer),
        connectionId: $optional($string),
        domainName: $optional($string),
        domainPrefix: $optional($string),
        eventType: $optional($string),
        extendedRequestId: $optional($string),
        protocol: $string,
        httpMethod: $string,
        identity: $ref(APIGatewayEventIdentity),
        messageDirection: $optional($string),
        messageId: $union([$string, $null]).optional(),
        path: $string,
        stage: $string,
        requestId: $string,
        requestTime: $optional($string),
        requestTimeEpoch: $integer,
        resourceId: $string,
        resourcePath: $string,
        routeKey: $optional($string),
    })

export const APIGatewayProxyEventBase = (context: ThereforeSchema) =>
    $object({
        body: $union([$string, $null]),
        headers: $ref(APIGatewayProxyEventHeaders),
        multiValueHeaders: $ref(APIGatewayProxyEventMultiValueHeaders),
        httpMethod: $string,
        isBase64Encoded: $boolean,
        path: $string,
        pathParameters: $union([$ref(APIGatewayProxyEventPathParameters), $null]),
        queryStringParameters: $union([$ref(APIGatewayProxyEventQueryStringParameters), $null]),
        multiValueQueryStringParameters: $union([$ref(APIGatewayProxyEventMultiValueQueryStringParameters), $null]),
        stageVariables: $union([$ref(APIGatewayProxyEventStageVariables), $null]),
        requestContext: APIGatewayEventRequestContextWithAuthorizer(context),
        resource: $string,
    })

export const APIGatewayProxyEvent = $validator(APIGatewayProxyEventBase(APIGatewayEventDefaultAuthorizerContext))
