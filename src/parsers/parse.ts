import { EventError, type EventOptions } from '../errors/event-error/event-error.js'
import type { GenericParser, InferFromParser } from './types.js'

export async function safeParse<T extends GenericParser>(
    parser: T | undefined,
    input: unknown,
    options: EventOptions & { location?: string } = {},
): Promise<InferFromParser<T> | EventError> {
    if (parser !== undefined) {
        if ('is' in parser) {
            return parser.is(input) ? (input as InferFromParser<T>) : EventError.validation({ errors: parser.errors, ...options })
        }
        const parsed = await parser['~standard'].validate(input)
        if (parsed.issues) {
            return EventError.validation({ issues: parsed.issues, ...options })
        }
        return parsed.value as InferFromParser<T>
    }

    return input as InferFromParser<T>
}
