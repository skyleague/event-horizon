import type { GenericParser, InferFromParser } from '../../parsers/types.js'

export function coerce<T extends GenericParser>(parser: T | undefined, input: unknown): InferFromParser<T> {
    if (parser !== undefined) {
        if ('is' in parser) {
            return parser.is(input) ? (input as InferFromParser<T>) : input
        }

        if ('~standard' in parser) {
            const parsed = parser['~standard'].validate(input)
            if (parsed instanceof Promise) {
                throw new TypeError('Schema validation must be synchronous')
            }

            if ('value' in parsed) {
                return parsed.value as InferFromParser<T>
            }
        }
    }

    return input as InferFromParser<T>
}
