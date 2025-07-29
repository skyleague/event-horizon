import type { Try } from '@skyleague/axioms'
import { mapTry, recoverTry, tryToError } from '@skyleague/axioms'
import type { APIGatewayIAMAuthorizerResult, APIGatewaySimpleAuthorizerResult } from 'aws-lambda'
import type { APIGatewayRequestAuthorizerEventV2Schema } from '../../../aws/http.js'
import type { APIGatewayRequestAuthorizerEventSchema } from '../../../aws/rest.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'
import { ioLoggerChild } from '../../functions/io-logger-child.js'
import type { LambdaContext } from '../../types.js'
import type { GatewayVersion } from '../event/types.js'
import { authorizerErrorHandler } from './functions/error-handler.js'
import { authorizerIOLogger } from './functions/io-logger.js'
import { authorizerIOValidate } from './functions/io-validate.js'
import { authorizerParseEvent } from './functions/parse-event.js'
import { authorizerSerializeResponse } from './functions/serialize-response.js'
import type { RequestAuthorizerHandler, SecuritySchemes } from './types.js'

export async function handleAuthorizerEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Context extends MaybeGenericParser,
    Security extends SecuritySchemes | undefined,
    GV extends GatewayVersion,
>(
    handler: RequestAuthorizerHandler<Configuration, Service, Profile, Path, Query, Headers, Context, Security, GV>,
    event: APIGatewayRequestAuthorizerEventV2Schema | APIGatewayRequestAuthorizerEventSchema,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<APIGatewayIAMAuthorizerResult | APIGatewaySimpleAuthorizerResult>> {
    const { request } = handler
    const parseEventFn = authorizerParseEvent(request)
    const ioValidateFn = authorizerIOValidate(request)

    const serializeResponseFn = authorizerSerializeResponse()
    const errorHandlerFn = authorizerErrorHandler(context)
    const inputOutputFn = authorizerIOLogger(context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    const unvalidatedAuthorizerEvent = mapTry(event, (e) => parseEventFn.before(e))

    const authorizerEvent = await mapTry(unvalidatedAuthorizerEvent, (e) => {
        ioLoggerChildFn.before({
            ...e.path,
        })

        return ioValidateFn.before(e)
    })

    inputOutputFn.before(authorizerEvent)

    const transform = await mapTry(authorizerEvent, (e) => request.handler(e, context))
    const response = recoverTry(transform, (f) => errorHandlerFn.onError(f))

    inputOutputFn.after(response)
    ioLoggerChildFn.after()

    return tryToError(mapTry(response, (r) => serializeResponseFn.onAfter(event, r)))
}
