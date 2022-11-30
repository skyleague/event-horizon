import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import { AppConfigData } from 'aws-sdk'

export const createAppConfigData = memoize<AppConfigData>(() => tracer.captureAWSClient(new AppConfigData()))
