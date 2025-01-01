import { z } from 'zod'

export const secretRotationEvent = z.object({
    Step: z.enum(['createSecret', 'finishSecret', 'setSecret', 'testSecret']),
    SecretId: z.string(),
    ClientRequestToken: z.string(),
})
