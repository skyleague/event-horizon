import { secretRotationEvent } from './secret-rotation.js'

import { SecretRotationEvent } from '../../aws/secret-rotation/secret-rotation.type.js'

import { forAll } from '@skyleague/axioms'
import { it } from 'vitest'

it('SecretRotationEvent === SecretRotationRequest.raw', () => {
    forAll(secretRotationEvent(), (r) => SecretRotationEvent.is(r.raw))
})

it('SecretRotationEvent handles correct types', () => {
    forAll(
        secretRotationEvent({
            config: {
                foo: 'bar',
            },
        }),
        (r) => SecretRotationEvent.is(r.raw),
    )
})
