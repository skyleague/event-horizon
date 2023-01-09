import { constants } from '../../constants'

import { Tracer as AWSTracer } from '@aws-lambda-powertools/tracer'

export interface Tracer {
    instance: AWSTracer
    trace: <R>(segmentName: string, fn: () => Promise<R>) => Promise<R>
    captureAWSv3Client: <T>(service: T) => T
}

export function createTracer(instance: AWSTracer = new AWSTracer({ serviceName: constants.serviceName })): Tracer {
    async function trace<R>(segmentName: string, fn: () => Promise<R>): Promise<R> {
        const segment = instance.getSegment()
        const subsegment = segment.addNewSubsegment(segmentName)
        instance.setSegment(subsegment)

        let response: R
        try {
            response = await fn()

            // Add the response as metadata
            instance.addResponseAsMetadata(response, process.env._HANDLER)
        } catch (err) {
            // Add the error as metadata
            instance.addErrorAsMetadata(err as Error)
            throw err
        } finally {
            // Close subsegment (the AWS Lambda one is closed automatically)
            subsegment.close()
            // Set back the facade segment as active again
            instance.setSegment(segment)
        }

        return response
    }

    function captureAWSv3Client<T>(service: T): T {
        return instance.captureAWSv3Client(service)
    }

    return { instance, trace, captureAWSv3Client }
}

export const tracer: Tracer = createTracer()
