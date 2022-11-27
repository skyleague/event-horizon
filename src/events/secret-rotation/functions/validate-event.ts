import { EventError } from '../../../errors/event-error'
import type { LambdaContext } from '../../types'
import type { SecretRotationRequest, SecretRotationServices } from '../types'

import type { Maybe, Try } from '@skyleague/axioms'
import { Nothing } from '@skyleague/axioms'

export function secretValidateEvent({ logger, services: { secretManager } }: LambdaContext<unknown, SecretRotationServices>) {
    return {
        before: async (request: SecretRotationRequest): Promise<Try<Maybe<SecretRotationRequest>>> => {
            const { secretId, step, clientRequestToken } = request
            logger.setBindings({ secretId, step, clientRequestToken })
            logger.info(`Starting secret rotation ${step}`)

            const metadata = await secretManager.describeSecret({ SecretId: secretId }).promise()
            if (metadata.RotationEnabled !== true) {
                logger.error('Secret does not have rotation enabled')
                return EventError.preconditionFailed()
            }

            const versions = metadata.VersionIdsToStages ?? {}

            if (!(clientRequestToken in versions)) {
                logger.error('Secret version has no stage for rotation')
                return EventError.preconditionFailed()
            }

            if (versions[clientRequestToken].includes('AWSCURRENT')) {
                logger.info('Secret version was already set as AWSCURRENT')
                return Nothing
            } else if (!versions[clientRequestToken].includes('AWSPENDING')) {
                logger.error('Secret version not set as AWSPENDING for rotation')
                return EventError.preconditionFailed()
            }
            return request
        },
    }
}