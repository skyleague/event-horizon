import type { LambdaContext } from '../../events/types'

import type { Segment, Subsegment } from 'aws-xray-sdk-core'

export function traceInvocation({ tracer }: LambdaContext) {
    let lambdaSegment: Segment | Subsegment

    function startSegment(): void {
        lambdaSegment = tracer.instance.getSegment()
        const handlerSegment = lambdaSegment.addNewSubsegment(`## ${process.env._HANDLER ?? ''}`)
        tracer.instance.setSegment(handlerSegment)
    }

    function endSegment(): void {
        const subsegment = tracer.instance.getSegment()
        subsegment.close()
        tracer.instance.setSegment(lambdaSegment as Segment)
    }

    return {
        before: () => {
            if (tracer.instance.isTracingEnabled()) {
                startSegment()
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
