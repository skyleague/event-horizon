import { httpErrorHandler } from './functions/error-handler'
import { httpIOLogger } from './functions/io-logger'
import { httpIOValidate } from './functions/io-validate'
import { httpParseEvent } from './functions/parse-event'
import { httpSerializeResponse } from './functions/serialize-response'
import type { HTTPHandler } from './types'

import type { LambdaContext } from '../types'

import type { Try } from '@skyleague/axioms'
import { mapTry, recoverTry } from '@skyleague/axioms'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'

export async function handleHTTPEvent(
    handler: HTTPHandler,
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    context: LambdaContext
): Promise<Try<APIGatewayProxyResult | APIGatewayProxyResultV2>> {
    const { http } = handler
    const parseEventFn = httpParseEvent(http)
    const ioValidateFn = httpIOValidate()
    const serializeResponseFn = httpSerializeResponse()
    const errorHandlerFn = httpErrorHandler(context)
    const inputOutputFn = httpIOLogger(http, context)

    parseEventFn.before(event)
    const httpEvent = mapTry(event, (e) => {
        const unvalidatedHttpEvent = parseEventFn.before(e)
        return ioValidateFn.before(http, unvalidatedHttpEvent)
    })

    inputOutputFn.before(httpEvent)

    const transform = await mapTry(httpEvent, (e) => http.handler(e, context))
    const response = recoverTry(transform, (f) => errorHandlerFn.onError(f))

    inputOutputFn.after(response)

    return mapTry(response, (r) => serializeResponseFn.onAfter(r))
}
