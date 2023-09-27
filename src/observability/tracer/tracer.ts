import { constants } from '../../constants.js'

import { Tracer as AWSTracer } from '@aws-lambda-powertools/tracer'

export interface Tracer {
    instance: AWSTracer
    trace: <R>(segmentName: string, fn: () => Promise<R>) => Promise<R>
    captureAWSv3Client: <T>(service: T) => T
}

export function createTracer(instance: AWSTracer = new AWSTracer({ serviceName: constants.serviceName })): Tracer {
    async function trace<R>(segmentName: string, fn: () => Promise<R>): Promise<R> {
        if (!instance.isTracingEnabled()) {
            return fn()
        }
        return instance.provider.captureAsyncFunc(segmentName, async (subsegment) => {
            let response: R
            try {
                response = await fn()

                // Add the response as metadata
                instance.addResponseAsMetadata(response, process.env._HANDLER)

                return response
            } catch (err) {
                // Add the error as metadata
                instance.addErrorAsMetadata(err as Error)
                throw err
            } finally {
                // Close subsegment (the AWS Lambda one is closed automatically)
                subsegment?.close()
                subsegment?.flush()
            }
        }) as Promise<R>
    }

    function captureAWSv3Client<T>(service: T): T {
        return instance.captureAWSv3Client(service)
    }

    return { instance, trace, captureAWSv3Client }
}

export const tracer: Tracer = createTracer()
