import { $boolean, $object, $optional, $ref, $string, $unknown, $validator } from '@skyleague/therefore'

export const cognitoIdentity = $object({
    cognitoIdentityId: $string,
    cognitoIdentityPoolId: $string,
})

export const clientContextClient = $object({
    installationId: $string,
    appTitle: $string,
    appVersionName: $string,
    appVersionCode: $string,
    appPackageName: $string,
})

export const clientContextEnv = $object({
    platformVersion: $string,
    platform: $string,
    make: $string,
    model: $string,
    locale: $string,
})

export const clientContext = $object({
    client: $ref(clientContextClient),
    Custom: $optional($unknown),
    env: $ref(clientContextEnv),
})

export const context = $validator(
    $object({
        callbackWaitsForEmptyEventLoop: $boolean,
        functionName: $string,
        functionVersion: $string,
        invokedFunctionArn: $string,
        memoryLimitInMB: $string,
        awsRequestId: $string,
        logGroupName: $string,
        logStreamName: $string,
        identity: $optional($ref(cognitoIdentity), 'explicit'),
        clientContext: $optional($ref(clientContext), 'explicit'),
    })
)
