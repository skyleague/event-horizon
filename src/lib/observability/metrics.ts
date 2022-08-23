import { serviceName, namespace } from '../constants'

import { Metrics as AWSMetrics } from '@aws-lambda-powertools/metrics'

export type Dimensions = Record<string, string>

export interface Metrics {
    instance: AWSMetrics
}

export function createMetrics(
    instance: AWSMetrics = new AWSMetrics({
        namespace,
        serviceName,
    })
): Metrics {
    return { instance }
}

export const metrics = createMetrics()
