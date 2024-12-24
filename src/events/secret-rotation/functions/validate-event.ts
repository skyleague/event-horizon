import type { Maybe, Try } from '@skyleague/axioms'
import { Nothing } from '@skyleague/axioms'
import type { SetRequired } from '@skyleague/axioms/types'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'
import type { DefaultServices, LambdaContext } from '../../types.js'
import type { SecretRotationRequest } from '../types.js'

export function secretValidateEvent<
    Configuration,
    Service extends SetRequired<DefaultServices, 'secretsManager'>,
    Profile extends MaybeGenericParser,
>({ logger, services: { secretsManager } }: LambdaContext<Configuration, Service, Profile>) {
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

            if (versions[clientRequestToken]?.includes('AWSCURRENT')) {
                logger.info('Secret version was already set as AWSCURRENT')
                return Nothing
            }
            if (!versions[clientRequestToken]?.includes('AWSPENDING')) {
                logger.error('Secret version not set as AWSPENDING for rotation')
                return EventError.preconditionFailed()
            }
            return request
        },
    }
}
