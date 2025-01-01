import type { Segment, Subsegment } from 'aws-xray-sdk-core'
import { captureFetchGlobal } from 'aws-xray-sdk-fetch'
import type { LambdaContext } from '../../types.js'

export function traceGlobal() {
    captureFetchGlobal(true)
}

export function traceInvocation<Context extends LambdaContext>({
    tracer,
    traceId,
    requestId,
}: Context): {
    before: () => void
    after: (response: unknown) => void
    onError: (error: Error) => undefined
} {
    let lambdaSegment: Segment | Subsegment | undefined
    let handlerSegment: Segment | Subsegment | undefined

    function startSegment(): void {
        const segment = tracer.instance.getSegment()
        if (segment === undefined) {
            return
        }

        lambdaSegment = segment
        handlerSegment = lambdaSegment.addNewSubsegment(`## ${process.env._HANDLER ?? ''}`)
        tracer.instance.setSegment(handlerSegment)
    }

    function endSegment(): void {
        if (handlerSegment === undefined || lambdaSegment === undefined) {
            return
        }

        handlerSegment.close()
        handlerSegment.flush()

        tracer.instance.setSegment(lambdaSegment as Segment)
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
