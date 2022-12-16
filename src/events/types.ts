import type { ProfileSchema } from './common/profile-handler'

import type { Logger } from '../observability/logger/logger'
import type { Metrics } from '../observability/metrics/metrics'
import type { Tracer } from '../observability/tracer/tracer'

import type { Context } from 'aws-lambda'

export interface LambdaContext<Configuration = never, Service = never, Profile = never> {
    logger: Logger
    tracer: Tracer
    metrics: Metrics
    isSensitive: boolean

    traceId: string
    requestId: string

    services: Service
    config: Configuration
    profile: Profile

    raw: Context
}

export interface EventHandlerDefinition<Configuration = never, Service = never, Profile = never> {
    config?: Config<Configuration>
    services?: Services<Configuration, Service>
    profile?: ProfileSchema<Profile>
    operationId?: string
    summary?: string
    description?: string
    tags?: string[]
    isSensitive?: boolean
}

export type Config<C> = C | (() => C | Promise<C>)
export type Services<C, S> = S | ((config: C) => Promise<S> | S)
