import { EventError } from '../../../errors/event-error/index.js'
import type { DefaultServices, LambdaContext } from '../../types.js'
import type { SecretRotationRequest } from '../types.js'

import type { Maybe, RequireKeys, Try } from '@skyleague/axioms'
import { Nothing } from '@skyleague/axioms'

export function secretValidateEvent<Configuration, Service extends RequireKeys<DefaultServices, 'secretsManager'>, Profile>({
    logger,
    services: { secretsManager },
}: LambdaContext<Configuration, Service, Profile>) {
    return {
        before: async (request: SecretRotationRequest): Promise<Try<Maybe<SecretRotationRequest>>> => {
            const { secretId, step, clientRequestToken } = request
            logger.setBindings({ secretId, step, clientRequestToken })
            logger.info(`Starting secret rotation ${step}`)

            const metadata = await secretsManager.describeSecret({ SecretId: secretId })
            if (metadata.RotationEnabled !== true) {
                logger.error('Secret does not have rotation enabled')
                return EventError.preconditionFailed()
            }

            const versions = metadata.VersionIdsToStages ?? {}

            if (!(clientRequestToken in versions)) {
                logger.error('Secret version has no stage for rotation')
                return EventError.preconditionFailed()
            }

            if (versions[clientRequestToken]!.includes('AWSCURRENT')) {
                logger.info('Secret version was already set as AWSCURRENT')
                return Nothing
            } else if (!versions[clientRequestToken]!.includes('AWSPENDING')) {
                logger.error('Secret version not set as AWSPENDING for rotation')
                return EventError.preconditionFailed()
            }
            return request
        },
    }
}
