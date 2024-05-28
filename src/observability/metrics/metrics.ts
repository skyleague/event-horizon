import { metricsConstants, serviceConstants } from '../../constants.js'

import type { MetricUnit } from '@aws-lambda-powertools/metrics'
import { Metrics as AWSMetrics } from '@aws-lambda-powertools/metrics'

export type Dimensions = Record<string, string>
export type Metric = (typeof MetricUnit)[keyof typeof MetricUnit]

export interface Metrics {
    instance: AWSMetrics
    add: (name: string, unit: Metric, value: number) => void
}

export function createMetrics(
    instance: AWSMetrics = new AWSMetrics({
        namespace: metricsConstants.namespace,
        serviceName: serviceConstants.serviceName,
    }),
): Metrics {
    function add(name: string, unit: Metric, value: number) {
        instance.addMetric(name, unit, value)
    }

    return { instance, add }
}

export const metrics = createMetrics()
