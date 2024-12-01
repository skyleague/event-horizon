import type { Schema } from '@skyleague/therefore'
import type { Infer, Schema as TSchema } from '@typeschema/main'

export type GenericParser = TSchema | Schema<unknown>
export type MaybeGenericParser = GenericParser | undefined
export type InferFromParser<T extends MaybeGenericParser, Default = unknown> = [T] extends [undefined]
    ? Default
    : T extends Schema<infer U>
      ? U
      : T extends TSchema
        ? Infer<T>
        : Default
