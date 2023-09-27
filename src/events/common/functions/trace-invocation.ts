import type { LambdaContext } from '../../types.js'

import type { Segment, Subsegment } from 'aws-xray-sdk-core'

export function traceInvocation({ tracer, traceId, requestId }: LambdaContext): {
    before: () => void
    after: (response: unknown) => void
    onError: (error: Error) => undefined
} {
    let lambdaSegment: Segment | Subsegment | undefined

    function startSegment(): void {
        lambdaSegment = tracer.instance.getSegment()
        if (lambdaSegment !== undefined) {
            const handlerSegment = lambdaSegment.addNewSubsegment(`## ${process.env._HANDLER ?? ''}`)
            tracer.instance.setSegment(handlerSegment)
        }
    }

    function endSegment(): void {
        const subsegment = tracer.instance.getSegment()
        subsegment?.close()
        subsegment?.flush()
        if (lambdaSegment !== undefined) {
            tracer.instance.setSegment(lambdaSegment as Segment)
        }
    }

    return {
        before: () => {
            if (tracer.instance.isTracingEnabled()) {
                startSegment()
                tracer.instance.putMetadata('requestId', requestId)
                tracer.instance.putMetadata('traceId', traceId)
                tracer.instance.annotateColdStart()
                tracer.instance.addServiceNameAnnotation()
            }
        },
        after: (response: unknown) => {
            if (tracer.instance.isTracingEnabled()) {
                tracer.instance.addResponseAsMetadata(response, process.env._HANDLER)
                endSegment()
            }
        },
        onError: (error: Error) => {
            if (tracer.instance.isTracingEnabled()) {
                tracer.instance.addErrorAsMetadata(error)
                endSegment()
            }
        },
    }
}
