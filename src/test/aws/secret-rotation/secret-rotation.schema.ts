import { $validator, $object, $string, $enum } from '@skyleague/therefore'

export const secretRotationEvent = $validator(
    $object({
        Step: $enum(['createSecret', 'finishSecret', 'setSecret', 'testSecret']),
        SecretId: $string,
        ClientRequestToken: $string,
    })
)
