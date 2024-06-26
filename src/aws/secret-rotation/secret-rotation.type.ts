/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as SecretRotationEventValidator } from './schemas/secret-rotation-event.schema.js'

export interface SecretRotationEvent {
    Step: 'createSecret' | 'finishSecret' | 'setSecret' | 'testSecret'
    SecretId: string
    ClientRequestToken: string
}

export const SecretRotationEvent = {
    validate: SecretRotationEventValidator as ValidateFunction<SecretRotationEvent>,
    get schema() {
        return SecretRotationEvent.validate.schema
    },
    get errors() {
        return SecretRotationEvent.validate.errors ?? undefined
    },
    is: (o: unknown): o is SecretRotationEvent => SecretRotationEvent.validate(o) === true,
    parse: (o: unknown): { right: SecretRotationEvent } | { left: DefinedError[] } => {
        if (SecretRotationEvent.is(o)) {
            return { right: o }
        }
        return { left: (SecretRotationEvent.errors ?? []) as DefinedError[] }
    },
} as const
