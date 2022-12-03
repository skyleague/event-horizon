import { tracer } from '../../observability/tracer/tracer'

import { SecretsManager } from '@aws-sdk/client-secrets-manager'
import { memoize } from '@skyleague/axioms'

/**
 * @group Services
 */
export const createSecretsManager = memoize<SecretsManager>(() => tracer.captureAWSv3Client(new SecretsManager({})))
