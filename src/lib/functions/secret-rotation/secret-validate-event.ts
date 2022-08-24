import type { LambdaContext } from '../../events/context'
import { HttpError } from '../../events/http/http-error'
import type { SecretRotationEventHandler, SecretRotationRequest } from '../../events/secret-rotation/types'

export function secretValidateEvent({ secretManager }: SecretRotationEventHandler, { logger }: LambdaContext) {
    return {
        before: async ({ secretId, step, clientRequestToken }: SecretRotationRequest) => {
            logger.setBindings({ secretId, step })
            logger.info('Starting secret rotation')

            const metadata = await secretManager.describeSecret({ SecretId: secretId }).promise()
            if (metadata.RotationEnabled !== true) {
                logger.error('Secret does not have rotation enabled')
                throw HttpError.unprocessableEntity()
            }

            const versions = metadata.VersionIdsToStages ?? {}

            if (!(clientRequestToken in versions)) {
                logger.error('Secret version has no stage for rotation')
                throw HttpError.unprocessableEntity()
            }

            if ('AWSCURRENT' in versions[clientRequestToken]) {
                logger.info('Secret version was already set as AWSCURRENT')
                return
            } else if (!('AWSPENDING' in versions[clientRequestToken])) {
                logger.error('Secret version not set as AWSPENDING for rotation')
                throw HttpError.unprocessableEntity()
            }
        },
    }
}
