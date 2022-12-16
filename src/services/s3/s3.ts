import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import S3 from 'aws-sdk/clients/s3'

/**
 * @group Services
 */
export const createS3 = memoize<S3>(() => tracer.captureAWSClient(new S3()))
