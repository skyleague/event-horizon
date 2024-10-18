import type { Tracer } from '../../../observability/tracer/tracer.js'
import { isAWSv3Client } from '../../../services/is-client/is-client.js'

import { isObject } from '@skyleague/axioms'

export function traceServices({ tracer }: { tracer: Tracer }) {
    return {
        before: <S>(services: S) => {
            if (isObject(services)) {
                for (const service of Object.values(services)) {
                    if (isAWSv3Client(service)) {
                        tracer.captureAWSv3Client(service)
                    }
                    if (typeof service === 'object' && service !== null) {
                        for (const client of Object.values(service)) {
                            if (isAWSv3Client(client)) {
                                tracer.captureAWSv3Client(client)
                            }
                        }
                    }
                }
            }
            return services
        },
    }
}
