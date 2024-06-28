import type { SetRequired } from '@skyleague/axioms/types'
import { SecretRotationEvent } from '../../../aws/secret-rotation/secret-rotation.type.js'
import type { SecretRotationHandler, SecretRotationRequest } from '../../../events/secret-rotation/types.js'
import type { DefaultServices } from '../../../events/types.js'

import type { Dependent } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function secretRotationEvent<Configuration, Service extends SetRequired<DefaultServices, 'secretsManager'>, Profile>(
    _?: Pick<SecretRotationHandler<Configuration, Service, Profile>, 'services' | 'config'>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SecretRotationRequest> {
    return arbitrary(SecretRotationEvent)
        .constant(generation === 'fast')
        .map((e) => ({
            raw: e,
            step: e.Step,
            secretId: e.SecretId,
            clientRequestToken: e.ClientRequestToken,
        }))
}
