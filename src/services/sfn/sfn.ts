import { tracer } from '../../observability/tracer/tracer'

import { SFN } from '@aws-sdk/client-sfn'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createSFN = memoize<SFN>(() => tracer.captureAWSv3Client(new SFN({})))
