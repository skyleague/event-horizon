import type { HttpEventHandler, HttpResponse } from './types'

import { httpErrorHandler } from '../../functions/http/http-error-handler'
import { httpIOLogger } from '../../functions/http/http-io-logger'
import { httpParseEvent } from '../../functions/http/http-parse-event'
import { httpSerializeResponse } from '../../functions/http/http-serialize-response'
import { httpValidateRequest } from '../../functions/http/http-validate-request'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import type { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'

export async function handleHttpEvent(
    http: HttpEventHandler | undefined,
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    context: LambdaContext
): Promise<APIGatewayProxyResult | APIGatewayProxyResultV2> {
    if (http === undefined) {
        throw EventError.notImplemented()
    }

    const parseEventFn = httpParseEvent(http)
    const validateRequestFn = httpValidateRequest()
    const serializeResponseFn = httpSerializeResponse()
    const errorHandlerFn = httpErrorHandler(context)
    const inputOutputFn = httpIOLogger(http, context)

    let response: HttpResponse
    try {
        const unvalidatedHttpEvent = parseEventFn.before(event)
        inputOutputFn.before(unvalidatedHttpEvent)
        const httpEvent = validateRequestFn.before(http, unvalidatedHttpEvent)

        if ('left' in httpEvent) {
            throw EventError.badRequest(httpEvent.left[0].message)
        }

        response = await http.handler(httpEvent.right, context)
    } catch (e: unknown) {
        response = errorHandlerFn.onError(e)
    }
    inputOutputFn.after(response)
    return serializeResponseFn.onAfter(response)
}
