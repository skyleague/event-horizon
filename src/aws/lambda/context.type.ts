/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as ContextValidator } from './schemas/context.schema.js'

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
    validate: ContextValidator as ValidateFunction<Context>,
    get schema() {
        return Context.validate.schema
    },
    get errors() {
        return Context.validate.errors ?? undefined
    },
    is: (o: unknown): o is Context => Context.validate(o) === true,
    parse: (o: unknown): { right: Context } | { left: DefinedError[] } => {
        if (Context.is(o)) {
            return { right: o }
        }
        return { left: (Context.errors ?? []) as DefinedError[] }
    },
} as const
