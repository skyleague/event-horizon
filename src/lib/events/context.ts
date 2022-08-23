import type { Logger } from '../observability/logger'
import type { Metrics } from '../observability/metrics'
import type { Tracer } from '../observability/tracer'

import type { Context } from 'aws-lambda'

export interface LambdaContext {
    logger: Logger
    tracer: Tracer
    metrics: Metrics
    isSensitive: boolean
    raw: Context
}
