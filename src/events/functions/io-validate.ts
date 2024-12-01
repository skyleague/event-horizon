import type { Try } from '@skyleague/axioms'
import type { Simplify } from '@skyleague/axioms/types'
import { EventError } from '../../errors/event-error/event-error.js'
import { safeParse } from '../../parsers/parse.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
type MappedSchema<T, Key extends keyof T | undefined, ST> = Key extends keyof T
    ? Simplify<Exclude<T, Key> & { [k in Key]: ST }>
    : never

export function ioValidate<I = unknown, O = unknown>(): {
    before: <
        SI extends MaybeGenericParser,
        Key extends keyof I | undefined = undefined,
        U = Key extends string ? Try<MappedSchema<I, Key, InferFromParser<SI>>> : Try<InferFromParser<SI>>,
    >(
        schema: SI,
        event: I,
        path?: Key,
    ) => Promise<U>
    after: <
        SO extends MaybeGenericParser,
        Key extends keyof O | undefined = undefined,
        U = Key extends string ? Try<MappedSchema<O, Key, InferFromParser<SO>>> : Try<InferFromParser<SO>>,
    >(
        schema: SO,
        event: O,
        path?: Key,
    ) => Promise<U>
} {
    return {
        before: async <
            SI extends MaybeGenericParser,
            Key extends keyof I | undefined = undefined,
            U = Key extends string ? Try<MappedSchema<I, Key, InferFromParser<SI>>> : Try<InferFromParser<SI>>,
        >(
            schema: SI,
            event: I,
            key?: Key,
        ): Promise<U> => {
            const unknownValue = key !== undefined ? event[key] : event
            const parsed = await safeParse(schema, unknownValue)
            if (key !== undefined && !(parsed instanceof EventError)) {
                return { ...event, [key]: parsed } as U
            }
            return parsed as U
        },
        after: async <
            SO extends MaybeGenericParser,
            Key extends keyof O | undefined = undefined,
            U = Key extends string ? Try<MappedSchema<O, Key, InferFromParser<SO>>> : Try<InferFromParser<SO>>,
        >(
            schema: SO,
            event: O,
            key?: Key,
        ): Promise<U> => {
            const unknownValue = key !== undefined ? event[key] : event
            const parsed = await safeParse(schema, unknownValue)
            if (key !== undefined && !(parsed instanceof EventError)) {
                return { ...event, [key]: parsed } as U
            }
            return parsed as U
        },
    }
}
