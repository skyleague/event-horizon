import type { Logger } from '../observability/logger/logger'
import type { Metrics } from '../observability/metrics/metrics'
import type { Tracer } from '../observability/tracer/tracer'

import type { Context } from 'aws-lambda'

export interface LambdaContext<C = never, S = never> {
    logger: Logger
    tracer: Tracer
    metrics: Metrics
    isSensitive: boolean

    services: S
    config: C

    raw: Context
}

export interface EventHandlerDefinition {
    operationId?: string
    summary?: string
    description?: string
    tags?: string[]
    logEvent?: boolean
    isSensitive?: boolean
}

export type Config<C> = C | (() => C | Promise<C>)
export type Services<C, S> = S | ((config: C) => Promise<S> | S)
