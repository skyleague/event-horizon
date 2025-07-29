import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf, it } from 'vitest'
import { secretRotationEvent as secretRotationEventSchema } from '../../../aws/secret-rotation/secret-rotation.schema.js'
import { secretRotationHandler } from '../../../events/secret-rotation/secret-rotation.js'
import type { SecretRotationRequest } from '../../../events/secret-rotation/types.js'
import { secretRotationEvent } from './secret-rotation.js'

it('SecretRotationEvent === SecretRotationRequest.raw', () => {
    forAll(secretRotationEvent(), (r) => {
        secretRotationEventSchema.parse(r.raw)
    })
})

it('should properly validate and type SecretRotation event payload', () => {
    forAll(
        secretRotationEvent(
            secretRotationHandler({
                secretRotation: {
                    handler: (event) => {
                        expectTypeOf(event).toEqualTypeOf<SecretRotationRequest>()
                    },
                },
            }),
        ),
        (request) => {
            expect(request.step).toBeDefined()
            expect(request.secretId).toBeDefined()
            expect(request.clientRequestToken).toBeDefined()

            expect(request.raw.SecretId).toEqual(request.secretId)
            expect(request.raw.ClientRequestToken).toEqual(request.clientRequestToken)

            secretRotationEventSchema.parse(request.raw)
        },
    )
})
