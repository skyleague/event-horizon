import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import SecretsManager from 'aws-sdk/clients/secretsmanager'

export const createSecretManager = memoize<SecretsManager>(() => tracer.captureAWSClient(new SecretsManager()))
