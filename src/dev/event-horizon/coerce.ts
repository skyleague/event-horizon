import type { GenericParser, InferFromParser } from '../../parsers/types.js'

export function coerce<T extends GenericParser>(parser: T | undefined, input: unknown): InferFromParser<T> {
    if (parser !== undefined) {
        if ('is' in parser) {
            return parser.is(input) ? (input as InferFromParser<T>) : input
        }
        if ('_def' in parser) {
            const parsed = parser.safeParse(input)
            return parsed.success ? parsed.data : input
        }
    }

    return input as InferFromParser<T>
}
