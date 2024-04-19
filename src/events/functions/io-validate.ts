import { EventError } from '../../errors/event-error/event-error.js'

import type { SimplifyOnce, Try } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'

type MappedSchema<T, Key extends keyof T | undefined, ST> = Key extends keyof T
    ? SimplifyOnce<Exclude<T, Key> & { [k in Key]: ST }>
    : never

export function ioValidate<I = unknown, O = unknown>(): {
    before: <SI, Key extends keyof I | undefined = undefined, U = Key extends string ? Try<MappedSchema<I, Key, SI>> : Try<SI>>(
        schema: Schema<SI> | undefined,
        event: I,
        path?: Key
    ) => U
    after: <SO, Key extends keyof O | undefined = undefined, U = Key extends string ? Try<MappedSchema<O, Key, SO>> : Try<SO>>(
        schema: Schema<SO> | undefined,
        event: O,
        path?: Key
    ) => U
} {
    return {
        before: <
            SI,
            Key extends keyof I | undefined = undefined,
            U = Key extends string ? Try<MappedSchema<I, Key, SI>> : Try<SI>,
        >(
            schema: Schema<SI> | undefined,
            event: I,
            key?: Key
        ): U => {
            const unknownValue = key !== undefined ? event[key] : event
            if (schema?.is(unknownValue) === false) {
                return EventError.validation({ errors: schema.errors }) as U
            }
            return event as unknown as U
        },
        after: <
            SO,
            Key extends keyof O | undefined = undefined,
            U = Key extends string ? Try<MappedSchema<O, Key, SO>> : Try<SO>,
        >(
            schema: Schema<SO> | undefined,
            event: O,
            key?: Key
        ): U => {
            const unknownValue = key !== undefined ? event[key] : event
            if (schema?.is(unknownValue) === false) {
                return EventError.validation({ errors: schema.errors }) as U
            }
            return event as unknown as U
        },
    }
}
