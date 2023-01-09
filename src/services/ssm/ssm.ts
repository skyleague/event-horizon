import { tracer } from '../../observability/tracer/tracer'

import { SSM } from '@aws-sdk/client-ssm'
import { SSMIncidents } from '@aws-sdk/client-ssm-incidents'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createSSM = memoize<SSM>(() => tracer.captureAWSv3Client(new SSM({})))

/**
 * @group Services
 */
export const createSSMIncidents = memoize<SSMIncidents>(() => tracer.captureAWSv3Client(new SSMIncidents({})))
