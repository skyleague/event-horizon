import type { ErrorObject } from 'ajv'
import type { StandardSchemaV1 } from '../errors/event-error/standard-schema.js'

interface ThereforeSchema<T> {
    is: (o: unknown) => o is T
    errors?: ErrorObject[] | null | undefined
}

export type GenericParser = StandardSchemaV1 | ThereforeSchema<unknown>
export type MaybeGenericParser = GenericParser | undefined
export type InferFromParser<T extends MaybeGenericParser, Default = unknown> = [T] extends [undefined]
    ? Default
    : T extends StandardSchemaV1
      ? StandardSchemaV1.InferOutput<T>
      : T extends ThereforeSchema<infer U>
        ? U
        : Default
