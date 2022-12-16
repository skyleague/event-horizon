import { tracer } from '../../observability/tracer/tracer'

import { memoize } from '@skyleague/axioms'
import SecretsManager from 'aws-sdk/clients/secretsmanager'

/**
 * @group Services
 */
export const createSecretsManager = memoize<SecretsManager>(() => tracer.captureAWSClient(new SecretsManager()))
