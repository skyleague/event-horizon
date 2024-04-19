import {
    $array,
    $boolean,
    $const,
    $dict,
    $integer,
    $null,
    $object,
    $optional,
    $ref,
    $string,
    $union,
    $unknown,
    $validator,
} from '@skyleague/therefore'
import type { ThereforeSchema } from '@skyleague/therefore/src/lib/primitives/types.js'

export const APIGatewayProxyEventHeaders = $dict($string)
export const APIGatewayProxyEventMultiValueHeaders = $dict($array($string))
export const APIGatewayProxyEventPathParameters = $dict($string)
export const APIGatewayProxyEventQueryStringParameters = $dict($string)
export const APIGatewayProxyEventMultiValueQueryStringParameters = $dict($array($string))
export const APIGatewayProxyEventStageVariables = $dict($string)

export const APIGatewayEventDefaultAuthorizerContext = $union([$const(undefined), $null, $dict($unknown)])

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
        connectedAt: $optional($integer, 'explicit'),
        connectionId: $optional($string, 'explicit'),
        domainName: $optional($string, 'explicit'),
        domainPrefix: $optional($string, 'explicit'),
        eventType: $optional($string, 'explicit'),
        extendedRequestId: $optional($string, 'explicit'),
        protocol: $string,
        httpMethod: $string,
        identity: $ref(APIGatewayEventIdentity),
        messageDirection: $optional($string, 'explicit'),
        messageId: $union([$string, $null, $const(undefined)]),
        path: $string,
        stage: $string,
        requestId: $string,
        requestTime: $optional($string, 'explicit'),
        requestTimeEpoch: $integer,
        resourceId: $string,
        resourcePath: $string,
        routeKey: $optional($string, 'explicit'),
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
