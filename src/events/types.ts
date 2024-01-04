import type { ProfileSchema } from './common/functions/profile-handler.js'

import type { Logger } from '../observability/logger/logger.js'
import type { Metrics } from '../observability/metrics/metrics.js'
import type { Tracer } from '../observability/tracer/tracer.js'

import type { AppConfigData } from '@aws-sdk/client-appconfigdata'
import type { SecretsManager } from '@aws-sdk/client-secrets-manager'
import type { Context } from 'aws-lambda'

export interface DefaultServices {
    [k: PropertyKey]: unknown
    appConfigData?: AppConfigData
    secretsManager?: SecretsManager
}

export interface LambdaContext<Configuration = unknown, Service = unknown, Profile = unknown> {
    logger: Logger
    tracer: Tracer
    metrics: Metrics
    isSensitive: boolean

    traceId: string
    requestId: string

    services: Service
    config: Configuration
    profile: Profile
    getRemainingTimeInMillis(): number
    raw: Context
}

export interface EventHandlerDefinition<Configuration = unknown, Service = unknown, Profile = unknown> {
    config?: Config<Configuration>
    services?: Services<Configuration, Service>
    profile?: ProfileSchema<Profile>
    operationId?: string
    summary?: string
    description?: string
    tags?: string[]
    isSensitive?: boolean
    logger?: Logger
    tracer?: Tracer
    metrics?: Metrics
}

export type Config<C> = C | (() => C | Promise<C>)
export type Services<C, S> = S | ((config: C) => Promise<S> | S)
