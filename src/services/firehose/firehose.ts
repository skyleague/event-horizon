import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import Firehose from 'aws-sdk/clients/firehose'

export const createFirehose = memoize<Firehose>(() => tracer.captureAWSClient(new Firehose()))
