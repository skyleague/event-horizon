import { httpErrorHandler } from './functions/error-handler'
import { httpIOLogger } from './functions/io-logger'
import { httpIOValidate } from './functions/io-validate'
import { httpParseEvent } from './functions/parse-event'
import { httpSerializeResponse } from './functions/serialize-response'
import type { HttpHandler, HttpResponse } from './types'

import { EventError } from '../../errors/event-error'
import type { LambdaContext } from '../types'

import type { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, APIGatewayProxyResultV2 } from 'aws-lambda'

export async function handleHttpEvent(
    handler: HttpHandler,
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    context: LambdaContext
): Promise<APIGatewayProxyResult | APIGatewayProxyResultV2> {
    const { http } = handler
    const parseEventFn = httpParseEvent(http)
    const ioValidateFn = httpIOValidate()
    const serializeResponseFn = httpSerializeResponse()
    const errorHandlerFn = httpErrorHandler(context)
    const inputOutputFn = httpIOLogger(http, context)

    let response: HttpResponse
    try {
        const unvalidatedHttpEvent = parseEventFn.before(event)
        inputOutputFn.before(unvalidatedHttpEvent)
        const httpEvent = ioValidateFn.before(http, unvalidatedHttpEvent)

        if ('left' in httpEvent) {
            throw EventError.badRequest(`in ${httpEvent.in}: ${httpEvent.left[0]?.message ?? 'validation failed'}`, {
                in: httpEvent.in,
            })
        }

        response = await http.handler(httpEvent.right, context)
    } catch (e: unknown) {
        response = errorHandlerFn.onError(e)
    }
    inputOutputFn.after(response)
    return serializeResponseFn.onAfter(response)
}
