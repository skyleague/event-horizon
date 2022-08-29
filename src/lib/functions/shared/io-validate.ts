import type { Either } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import type { ErrorObject } from 'ajv'

export interface ValidateOptions<E, R> {
    input?: (x: E) => unknown
    output?: (x: R) => unknown
}

export function ioValidate<I = unknown, O = unknown>(options?: ValidateOptions<I, O>) {
    return {
        before: (schema: Schema<unknown> | undefined, event: I): Either<ErrorObject[], I> => {
            const unknownValue = options?.input?.(event) ?? event
            if (schema?.is(unknownValue) === false) {
                return { left: schema?.validate.errors ?? [] }
            }
            return {
                right: event,
            }
        },
        after: (schema: Schema<unknown> | undefined, event: O): Either<ErrorObject[], O> => {
            const unknownValue = options?.output?.(event) ?? event
            if (schema?.is(unknownValue) === false) {
                return { left: schema?.validate.errors ?? [] }
            }
            return {
                right: event,
            }
        },
    }
}
