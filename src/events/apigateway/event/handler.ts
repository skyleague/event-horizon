import type { Try } from '@skyleague/axioms'
import { mapTry, recoverTry } from '@skyleague/axioms'
import type { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'
import type { APIGatewayProxyEventV2Schema } from '../../../aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'
import type { MaybeGenericParser } from '../../../parsers/types.js'
import { ioLoggerChild } from '../../functions/io-logger-child.js'
import type { LambdaContext, ResponseFromHandler } from '../../types.js'
import type { SecurityRequirements } from '../types.js'
import { httpErrorHandler } from './functions/error-handler.js'
import { httpIOLogger } from './functions/io-logger.js'
import { httpIOValidate } from './functions/io-validate.js'
import { httpParseEvent } from './functions/parse-event.js'
import { httpSerializeResponse } from './functions/serialize-response.js'
import type { AuthorizerSchema, HTTPEventHandler, HTTPHandler, HTTPResponse, Responses } from './types.js'
import type { GatewayVersion } from './types.js'

export async function handleHTTPEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Body extends MaybeGenericParser,
    Path extends MaybeGenericParser,
    Query extends MaybeGenericParser,
    Headers extends MaybeGenericParser,
    Result extends Responses,
    Security extends SecurityRequirements | undefined,
    GV extends GatewayVersion,
    Authorizer extends AuthorizerSchema<GV>,
>(
    handler: HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV, Authorizer>,
    event: APIGatewayProxyEventV2Schema | APIGatewayProxyEventSchema,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<APIGatewayProxyResult | APIGatewayProxyResultV2>> {
    const { http } = handler
    const parseEventFn = httpParseEvent(http)
    const ioValidateFn = httpIOValidate(http)
    const serializeResponseFn = httpSerializeResponse()
    const errorHandlerFn = httpErrorHandler(context, handler.serialize?.error)
    const inputOutputFn = httpIOLogger(http, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    const unvalidatedAuthorizer = mapTry(event, (e) => parseEventFn.authorization(e))
    const unvalidatedHttpEvent = mapTry(unvalidatedAuthorizer, (a) => parseEventFn.before(event, a))

    const httpEvent = await mapTry(unvalidatedHttpEvent, (e) => {
        ioLoggerChildFn.before({
            ...e.path,
        })

        return ioValidateFn.before(e)
    })

    inputOutputFn.before(httpEvent)

    const transform = await mapTry(httpEvent, (e) => http.handler(e, context))
    const response = recoverTry(transform, (f) => errorHandlerFn.onError(f))

    inputOutputFn.after(
        // @todo remove cast
        response as Awaited<
            ResponseFromHandler<
                HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, Security, GV, Authorizer>
            >
        >,
    )
    ioLoggerChildFn.after()

    // @todo remove cast
    return mapTry(response, (r) => serializeResponseFn.onAfter(r as HTTPResponse))
}
