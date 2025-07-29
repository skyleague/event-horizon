import { AppConfigData } from '@aws-sdk/client-appconfigdata'
import { memoize } from '@skyleague/axioms'
import { tracer } from '../../observability/tracer/tracer.js'

/**
 * @group Services
 * @internal
 */
export const createAppConfigData = memoize(() => tracer.captureAWSv3Client(new AppConfigData({})))
