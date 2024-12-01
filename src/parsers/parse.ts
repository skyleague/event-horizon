import { validate } from '@typeschema/main'
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
        const parsed = await validate(parser, input)
        return parsed.success ? (parsed.data as InferFromParser<T>) : EventError.validation({ issues: parsed.issues, ...options })
    }

    return input as InferFromParser<T>
}
