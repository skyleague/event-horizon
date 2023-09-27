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
