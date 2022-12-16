import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import { SSMIncidents } from 'aws-sdk'
import SSM from 'aws-sdk/clients/ssm'

/**
 * @group Services
 */
export const createSSM = memoize<SSM>(() => tracer.captureAWSClient(new SSM()))

/**
 * @group Services
 */
export const createSSMIncidents = memoize<SSMIncidents>(() => tracer.captureAWSClient(new SSMIncidents()))
