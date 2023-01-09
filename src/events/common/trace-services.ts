import type { Tracer } from '../../observability'
import { isAWSv3Client } from '../../services/is-client/is-client'

import { isObject } from '@skyleague/axioms'

export function traceServices({ tracer }: { tracer: Tracer }) {
    return {
        before: <S>(services: S) => {
            if (isObject(services)) {
                for (const service of Object.values(services)) {
                    if (isAWSv3Client(service)) {
                        tracer.captureAWSv3Client(service)
                    }
                }
            }
            return services
        },
    }
}
