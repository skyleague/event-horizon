import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import EventBridge from 'aws-sdk/clients/eventbridge'

/**
 * @group Services
 */
export const createEventBridge = memoize<EventBridge>(() => tracer.captureAWSClient(new EventBridge()))
