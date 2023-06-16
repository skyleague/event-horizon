import type { Dimensions } from '../../observability/metrics/metrics.js'
import type { LambdaContext } from '../types.js'

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
        // prevent logging an error inside the cloudwatch logs
        const storedMetrics = (metrics.instance as unknown as { storedMetrics?: object }).storedMetrics
        if (storedMetrics === undefined || Object.keys(storedMetrics).length > 0) {
            metrics.instance.publishStoredMetrics()
        }
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
