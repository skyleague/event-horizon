import { httpErrorHandler } from './functions/error-handler.js'
import { httpIOLogger } from './functions/io-logger.js'
import { httpIOValidate } from './functions/io-validate.js'
import { httpParseEvent } from './functions/parse-event.js'
import { httpSerializeResponse } from './functions/serialize-response.js'
import type { GatewayVersion, HTTPHandler } from './types.js'

import { ioLoggerChild } from '../functions/io-logger-child.js'
import type { LambdaContext } from '../types.js'

import type { Try } from '@skyleague/axioms'
import { mapTry, recoverTry } from '@skyleague/axioms'
import type { APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'
import type { APIGatewayProxyEventV2Schema } from '../../aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../aws/apigateway/rest.type.js'

export async function handleHTTPEvent<
    Configuration,
    Service,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result,
    GV extends GatewayVersion = 'http',
>(
    handler: HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>,
    event: APIGatewayProxyEventV2Schema | APIGatewayProxyEventSchema,
    context: LambdaContext<Configuration, Service, Profile>,
): Promise<Try<APIGatewayProxyResult | APIGatewayProxyResultV2>> {
    const { http } = handler
    const parseEventFn = httpParseEvent(http)
    const ioValidateFn = httpIOValidate<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>()
    const serializeResponseFn = httpSerializeResponse()
    const errorHandlerFn = httpErrorHandler(context, handler.serialize?.error)
    const inputOutputFn = httpIOLogger(http, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    const unvalidatedHttpEvent = mapTry(event, (e) => parseEventFn.before(e))

    const httpEvent = mapTry(unvalidatedHttpEvent, (e) => {
        ioLoggerChildFn.before({
            ...e.path,
        })

        return ioValidateFn.before(http, e)
    })

    inputOutputFn.before(httpEvent)

    const transform = await mapTry(httpEvent, (e) => http.handler(e, context))
    const response = recoverTry(transform, (f) => errorHandlerFn.onError(f))

    inputOutputFn.after(response)
    ioLoggerChildFn.after()

    return mapTry(response, (r) => serializeResponseFn.onAfter(r))
}
