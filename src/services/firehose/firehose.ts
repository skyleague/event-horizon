import { tracer } from '../../observability/tracer/tracer'

import { Firehose } from '@aws-sdk/client-firehose'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createFirehose = memoize<Firehose>(() => tracer.captureAWSv3Client(new Firehose({})))
