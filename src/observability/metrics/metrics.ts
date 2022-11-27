import { constants } from '../../constants'

import { Metrics as AWSMetrics } from '@aws-lambda-powertools/metrics'
import type { MetricUnit } from '@aws-lambda-powertools/metrics/lib/types'

export type Dimensions = Record<string, string>

export interface Metrics {
    instance: AWSMetrics
    add: (name: string, unit: `${MetricUnit}`, value: number) => void
}

export function createMetrics(
    instance: AWSMetrics = new AWSMetrics({
        namespace: constants.namespace,
        serviceName: constants.serviceName,
    })
): Metrics {
    function add(name: string, unit: `${MetricUnit}`, value: number) {
        instance.addMetric(name, unit as MetricUnit, value)
    }

    return { instance, add }
}

export const metrics = createMetrics()
