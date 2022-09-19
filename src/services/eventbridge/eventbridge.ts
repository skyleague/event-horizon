import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import EventBridge from 'aws-sdk/clients/eventbridge'

export const createEventBridge = memoize<EventBridge>(() => tracer.captureAWSClient(new EventBridge()))
