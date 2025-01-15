import type { Dependent } from '@skyleague/axioms'
import type { SetRequired } from '@skyleague/axioms/types'
import { arbitrary } from '@skyleague/therefore'
import { secretRotationEvent as secretRotationEventSchema } from '../../../aws/secret-rotation/secret-rotation.schema.js'
import type { SecretRotationHandler, SecretRotationRequest } from '../../../events/secret-rotation/types.js'
import type { DefaultServices } from '../../../events/types.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'

export function secretRotationEvent<
    Configuration,
    Service extends SetRequired<DefaultServices, 'secretsManager'>,
    Profile extends MaybeGenericParser,
>(
    _?: Pick<SecretRotationHandler<Configuration, Service, Profile>, 'services' | 'config'>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<SecretRotationRequest> {
    return arbitrary(secretRotationEventSchema)
        .constant(generation === 'fast')
        .map((e) => ({
            raw: e,
            step: e.Step,
            secretId: e.SecretId,
            clientRequestToken: e.ClientRequestToken,
        }))
}
