import type { Try } from '@skyleague/axioms'
import { mapTry, tryAsValue } from '@skyleague/axioms'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'
import type { RawHandler } from './types.js'

export async function handleRawEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser,
    Result extends MaybeGenericParser,
>(
    handler: RawHandler<Configuration, Service, Profile, Payload, Result>,
    event: unknown,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<Result>> {
    const { raw } = handler
    const ioValidateFn = ioValidate<{ raw: unknown }>()
    const ioLoggerFn = ioLogger({ type: 'raw' }, context)

    ioLoggerFn.before(event)

    const rawEvent = await mapTry({ raw: event }, (e) => ioValidateFn.before(raw.schema.payload, e, 'raw'))
    const response = await mapTry(rawEvent, (e) => raw.handler(e.raw, context))

    ioLoggerFn.after(tryAsValue(response))

    return response as Try<Result>
}
