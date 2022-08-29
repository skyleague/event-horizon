import type { Logger } from '../observability/logger'
import type { Metrics } from '../observability/metrics'
import type { Tracer } from '../observability/tracer'
import type { Services } from '../types'

import type { Context } from 'aws-lambda'

export interface LambdaContext<S extends Services | undefined = undefined> {
    logger: Logger
    tracer: Tracer
    metrics: Metrics
    isSensitive: boolean

    services: S

    raw: Context
}
