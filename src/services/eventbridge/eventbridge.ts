import { tracer } from '../../observability/tracer/tracer'

import { EventBridge } from '@aws-sdk/client-eventbridge'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createEventBridge = memoize<EventBridge>(() => tracer.captureAWSv3Client(new EventBridge({})))
