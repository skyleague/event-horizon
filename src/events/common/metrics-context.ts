import type { Dimensions } from '../../observability/metrics/metrics'
import type { LambdaContext } from '../types'

export function metricsContext(
    { metrics }: LambdaContext,
    {
        dimensions,
        captureColdStartMetric = true,
        functionName,
    }: {
        dimensions?: Dimensions
        captureColdStartMetric?: boolean
        functionName?: string
    } = {}
) {
    function publishMetrics() {
        metrics.instance.publishStoredMetrics()
    }

    return {
        before: () => {
            if (functionName !== undefined) {
                metrics.instance.setFunctionName(functionName)
            }
            if (captureColdStartMetric) {
                metrics.instance.captureColdStartMetric()
            }
            if (dimensions !== undefined) {
                metrics.instance.setDefaultDimensions(dimensions)
            }
        },
        after: publishMetrics,
        onError: publishMetrics,
    }
}
