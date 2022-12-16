import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import SFN from 'aws-sdk/clients/stepfunctions'

/**
 * @group Services
 */
export const createSFN = memoize<SFN>(() => tracer.captureAWSClient(new SFN()))
