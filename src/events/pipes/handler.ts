import { pipeErrorHandler } from './functions/error-handler.js'
import { pipeParseEvent } from './functions/parse-event.js'
import type { PipesHandler } from './types.js'

import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { eitherAsValue, enumerate, isLeft, mapLeft, mapTry, tryToEither } from '@skyleague/axioms'

export async function handlePipesEvent(
    handler: PipesHandler,
    events: unknown[],
    context: LambdaContext
): Promise<Try<unknown[]>> {
    const { pipe } = handler
    const errorHandlerFn = pipeErrorHandler(context)
    const parseEventFn = pipeParseEvent(pipe)
    const ioValidateFn = ioValidate()
    const ioLoggerFn = ioLogger({ type: 'pipe' }, context)

    ioLoggerFn.before(events)
    const responses: unknown[] = []
    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const pipesEvent = mapTry(event, (e) => {
            const unvalidatedPipesEvent = parseEventFn.before(e)
            return ioValidateFn.before(pipe.schema.payload, unvalidatedPipesEvent)
        })

        ioLoggerFn.before(pipesEvent, item)

        const transformed = await mapTry(pipesEvent, (success) => pipe.handler(success, context))

        const eitherTransformed = tryToEither(transformed)
        const response = mapLeft(eitherTransformed, (e) => errorHandlerFn.onError(event, e))

        ioLoggerFn.after(eitherAsValue(response), item)

        if (isLeft(response)) {
            return response.left
        } else {
            responses.push(response.right)
        }
    }

    return responses
}
