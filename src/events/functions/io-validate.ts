import { EventError } from '../../errors'

import type { Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

export interface ValidateOptions<I, O> {
    input?: (x: I) => unknown
    output?: (x: O) => unknown
}

export function ioValidate<I = unknown, O = unknown>(
    options?: ValidateOptions<I, O>
): {
    before: (schema: Schema<unknown> | undefined, event: I) => Try<I>
    after: (schema: Schema<unknown> | undefined, event: O) => Try<O>
} {
    return {
        before: (schema: Schema<unknown> | undefined, event: I): Try<I> => {
            const unknownValue = options?.input?.(event) ?? event
            if (schema?.is(unknownValue) === false) {
                return EventError.validation({ errors: schema.errors })
            }
            return event
        },
        after: (schema: Schema<unknown> | undefined, event: O): Try<O> => {
            const unknownValue = options?.output?.(event) ?? event
            if (schema?.is(unknownValue) === false) {
                return EventError.validation({ errors: schema.errors })
            }
            return event
        },
    }
}
