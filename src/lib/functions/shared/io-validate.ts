import type { Either } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { ErrorObject } from 'ajv'

export interface ValidateOptions<E, R> {
    request?: (x: E) => unknown
    response?: (x: R) => unknown
}

export function ioValidate<E = unknown, R = unknown>(options?: ValidateOptions<E, R>) {
    return {
        before: (schema: Schema<unknown> | undefined, event: E): Either<ErrorObject[], E> => {
            const unknownValue = options?.request?.(event) ?? event
            if (schema?.is(unknownValue) === false) {
                return { left: schema?.validate.errors ?? [] }
            }
            return {
                right: event,
            }
        },
        after: (schema: Schema<unknown> | undefined, event: R): Either<ErrorObject[], R> => {
            const unknownValue = options?.response?.(event) ?? event
            if (schema?.is(unknownValue) === false) {
                return { left: schema?.validate.errors ?? [] }
            }
            return {
                right: event,
            }
        },
    }
}
