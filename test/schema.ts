import type { Schema } from '@skyleague/therefore'

export const neverTrueSchema = {
    is: () => false,
    schema: {},
    validate: {
        errors: [],
    },
} as unknown as Schema<string>

export const alwaysTrueSchema = {
    is: () => true,
    schema: {},
    validate: {
        errors: [],
    },
} as unknown as Schema<string>

export const literalSchema = <const L>() =>
    ({
        is: (x: unknown): x is { foo: L } => true,
        schema: {},
        validate: {
            errors: [],
        },
    }) as unknown as Schema<L>

export const warmerEvent = '__WARMER__'
