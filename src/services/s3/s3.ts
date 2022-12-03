import { tracer } from '../../observability/tracer/tracer'

import { S3 } from '@aws-sdk/client-s3'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createS3 = memoize<S3>(() => tracer.captureAWSv3Client(new S3({})))
