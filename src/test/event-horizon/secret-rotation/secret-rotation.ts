import type { SecretRotationHandler, SecretRotationRequest } from '../../../events/secret-rotation/types.js'
import type { DefaultServices } from '../../../events/types.js'
import { SecretRotationEvent } from '../../aws/secret-rotation/secret-rotation.type.js'

import type { Dependent, RequireKeys } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export function secretRotationEvent<Configuration, Service extends RequireKeys<DefaultServices, 'secretsManager'>, Profile>(
    _?: Pick<SecretRotationHandler<Configuration, Service, Profile>, 'services' | 'config'>
): Dependent<SecretRotationRequest> {
    return arbitrary(SecretRotationEvent).map((e) => ({
        raw: e,
        step: e.Step,
        secretId: e.SecretId,
        clientRequestToken: e.ClientRequestToken,
    }))
}
