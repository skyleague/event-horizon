import { tracer } from '../observability/tracer'

import { memoize } from '@skyleague/axioms'
import { SecretsManager } from 'aws-sdk'

export const createSecretManager = memoize<SecretsManager>(() => tracer.captureAWSClient(new SecretsManager()))
