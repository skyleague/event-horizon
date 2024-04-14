import type { RawHandler } from './types.js'

import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { mapTry, tryAsValue } from '@skyleague/axioms'
import type { AsTry } from '@skyleague/axioms/src/data/try/try.js'

export async function handleRawEvent<Configuration, Service, Profile, Payload, Result>(
    handler: RawHandler<Configuration, Service, Profile, Payload, Result>,
    event: unknown,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<Result>> {
    const { raw } = handler
    const ioValidateFn = ioValidate<{ raw: unknown }>()
    const ioLoggerFn = ioLogger({ type: 'raw' }, context)

    ioLoggerFn.before(event)

    const rawEvent = mapTry({ raw: event }, (e) => ioValidateFn.before(raw.schema.payload, e, 'raw'))
    const response: Awaited<AsTry<Result>> | Awaited<Result> | Error = await mapTry(rawEvent, (e) => raw.handler(e.raw, context))

    ioLoggerFn.after(tryAsValue(response))

    return response as Try<Result>
}
