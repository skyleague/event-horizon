import { tracer } from '../../observability/tracer/tracer.js'

import { AppConfigData } from '@aws-sdk/client-appconfigdata'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 * @internal
 */
export const createAppConfigData = memoize(() => tracer.captureAWSv3Client(new AppConfigData({})))
