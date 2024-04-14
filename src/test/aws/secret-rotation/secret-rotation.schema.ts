import { $enum, $object, $string, $validator } from '@skyleague/therefore'

export const secretRotationEvent = $validator(
    $object({
        Step: $enum(['createSecret', 'finishSecret', 'setSecret', 'testSecret']),
        SecretId: $string,
        ClientRequestToken: $string,
    }),
)
