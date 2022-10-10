import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import SSM from 'aws-sdk/clients/ssm'

export const createSSM = memoize<SSM>(() => tracer.captureAWSClient(new SSM()))
