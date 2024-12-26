import { z } from 'zod'

export const cognitoIdentity = z.object({
    cognitoIdentityId: z.string(),
    cognitoIdentityPoolId: z.string(),
})

export const clientContextClient = z.object({
    installationId: z.string(),
    appTitle: z.string(),
    appVersionName: z.string(),
    appVersionCode: z.string(),
    appPackageName: z.string(),
})

export const clientContextEnv = z.object({
    platformVersion: z.string(),
    platform: z.string(),
    make: z.string(),
    model: z.string(),
    locale: z.string(),
})

export const clientContext = z.object({
    client: clientContextClient,
    Custom: z.unknown().optional(),
    env: clientContextEnv,
})

export const context = z.object({
    callbackWaitsForEmptyEventLoop: z.boolean(),
    functionName: z.string(),
    functionVersion: z.string(),
    invokedFunctionArn: z.string(),
    memoryLimitInMB: z.string(),
    awsRequestId: z.string(),
    logGroupName: z.string(),
    logStreamName: z.string(),
    identity: cognitoIdentity.optional(),
    clientContext: clientContext.optional(),
})
