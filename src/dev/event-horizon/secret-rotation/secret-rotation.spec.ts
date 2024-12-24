import { forAll } from '@skyleague/axioms'
import { expect, expectTypeOf } from 'vitest'
import { it } from 'vitest'
import { SecretRotationEvent } from '../../../aws/secret-rotation/secret-rotation.type.js'
import { secretRotationHandler } from '../../../events/secret-rotation/secret-rotation.js'
import type { SecretRotationRequest } from '../../../events/secret-rotation/types.js'
import { secretRotationEvent } from './secret-rotation.js'

it('SecretRotationEvent === SecretRotationRequest.raw', () => {
    forAll(secretRotationEvent(), (r) => SecretRotationEvent.is(r.raw))
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

            expect(SecretRotationEvent.is(request.raw)).toBe(true)
        },
    )
})
