import type { Schema } from '@skyleague/therefore'
import type { Infer, Schema as TSchema } from '@typeschema/main'
import type { ZodTypeAny } from 'zod'

export type GenericParser = TSchema | Schema<unknown> | ZodTypeAny
export type MaybeGenericParser = GenericParser | undefined
export type InferFromParser<T extends MaybeGenericParser, Default = unknown> = [T] extends [undefined]
    ? Default
    : T extends { readonly _output: infer U }
      ? U
      : T extends Schema<infer U>
        ? U
        : T extends TSchema
          ? Infer<T>
          : Default
