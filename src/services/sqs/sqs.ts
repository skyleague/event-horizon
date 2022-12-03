import { tracer } from '../../observability/tracer/tracer'

import { SQS } from '@aws-sdk/client-sqs'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createSQS = memoize<SQS>(() => tracer.captureAWSv3Client(new SQS({})))
