import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import SQS from 'aws-sdk/clients/sqs'

/**
 * @group Services
 */
export const createSQS = memoize<SQS>(() => tracer.captureAWSClient(new SQS()))
