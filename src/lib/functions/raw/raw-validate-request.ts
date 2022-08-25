import type { RawEventHandler } from '../../events/raw/types'

import type { Either } from '@skyleague/axioms'
import type { ErrorObject } from 'ajv'

export function rawValidateRequest<E = unknown>() {
    return {
        before: (raw: RawEventHandler, event: unknown): Either<ErrorObject[], E> => {
            if (raw.schema.event?.is(event) === false) {
                return { left: raw.schema.event?.validate.errors ?? [] }
            }
            return {
                right: event as E,
            }
        },
    }
}
