import type { Schema } from '@skyleague/therefore'
import type { StandardSchemaV1 } from '../errors/event-error/standard-schema.js'

export type GenericParser = StandardSchemaV1 | Schema<unknown>
export type MaybeGenericParser = GenericParser | undefined
export type InferFromParser<T extends MaybeGenericParser, Default = unknown> = [T] extends [undefined]
    ? Default
    : T extends Schema<infer U>
      ? U
      : T extends StandardSchemaV1
        ? StandardSchemaV1.InferOutput<T>
        : Default
