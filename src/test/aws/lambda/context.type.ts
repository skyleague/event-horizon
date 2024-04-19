/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */
import AjvValidator from 'ajv'
import type { ValidateFunction } from 'ajv'

export interface ClientContext {
    client: ClientContextClient
    Custom?: unknown
    env: ClientContextEnv
}

export interface ClientContextClient {
    installationId: string
    appTitle: string
    appVersionName: string
    appVersionCode: string
    appPackageName: string
}

export interface ClientContextEnv {
    platformVersion: string
    platform: string
    make: string
    model: string
    locale: string
}

export interface CognitoIdentity {
    cognitoIdentityId: string
    cognitoIdentityPoolId: string
}

export interface Context {
    callbackWaitsForEmptyEventLoop: boolean
    functionName: string
    functionVersion: string
    invokedFunctionArn: string
    memoryLimitInMB: string
    awsRequestId: string
    logGroupName: string
    logStreamName: string
    identity?: CognitoIdentity | undefined
    clientContext?: ClientContext | undefined
}

export const Context = {
    validate: (await import('./schemas/context.schema.js')).validate10 as unknown as ValidateFunction<Context>,
    get schema() {
        return Context.validate.schema
    },
    get errors() {
        return Context.validate.errors ?? undefined
    },
    is: (o: unknown): o is Context => Context.validate(o) === true,
    assert: (o: unknown) => {
        if (!Context.validate(o)) {
            throw new AjvValidator.ValidationError(Context.errors ?? [])
        }
    },
} as const
