import type { HttpResponse, TokenAuthorizerHandler } from './types'

import { tokenAuthorizerParseEvent } from '../../functions/authorizer/parse-event'
import { httpErrorHandler } from '../../functions/http/error-handler'
import { httpIOLogger } from '../../functions/http/io-logger'
import { httpIOValidate } from '../../functions/http/io-validate'
import { httpSerializeResponse } from '../../functions/http/serialize-response'
import type { LambdaContext } from '../context'
import { EventError } from '../event-error'

import type { APIGatewaySimpleAuthorizerWithContextResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'

export async function handleTokenAuthorizerEvent<Ctx = unknown>(
    handler: TokenAuthorizerHandler,
    event: APIGatewayTokenAuthorizerEvent,
    context: LambdaContext
): Promise<APIGatewaySimpleAuthorizerWithContextResult<Ctx>> {
    const { token } = handler
    const parseEventFn = tokenAuthorizerParseEvent()
    const ioValidateFn = httpIOValidate()
    const serializeResponseFn = httpSerializeResponse()
    const errorHandlerFn = httpErrorHandler(context)
    const inputOutputFn = httpIOLogger(token, context)

    let response: HttpResponse
    try {
        const unvalidatedHttpEvent = parseEventFn.before(event)
        inputOutputFn.before(unvalidatedHttpEvent)
        const httpEvent = ioValidateFn.before(http, unvalidatedHttpEvent)

        if ('left' in httpEvent) {
            throw EventError.badRequest(httpEvent.left[0].message, { in: httpEvent.in })
        }

        response = await token.handler(httpEvent.right, context)
    } catch (e: unknown) {
        response = errorHandlerFn.onError(e)
    }
    inputOutputFn.after(response)
    return serializeResponseFn.onAfter(response)
}

// export async function handleAuthorizerEvent<Ctx = unknown>(
//     handler: EventHandler,
//     event: APIGatewayAuthorizerEvent | APIGatewayRequestAuthorizerEventV2,
//     context: LambdaContext
// ): Promise<APIGatewaySimpleAuthorizerWithContextResult<Ctx>> {
//     const { http } = handler
//     const parseEventFn = httpParseEvent(http)
//     const ioValidateFn = httpIOValidate()
//     const serializeResponseFn = httpSerializeResponse()
//     const errorHandlerFn = httpErrorHandler(context)
//     const inputOutputFn = httpIOLogger(http, context)

//     let response: HttpResponse
//     try {
//         const unvalidatedHttpEvent = parseEventFn.before(event)
//         inputOutputFn.before(unvalidatedHttpEvent)
//         const httpEvent = ioValidateFn.before(http, unvalidatedHttpEvent)

//         if ('left' in httpEvent) {
//             throw EventError.badRequest(httpEvent.left[0].message, { in: httpEvent.in })
//         }

//         response = await http.handler(httpEvent.right, context)
//     } catch (e: unknown) {
//         response = errorHandlerFn.onError(e)
//     }
//     inputOutputFn.after(response)
//     return serializeResponseFn.onAfter(response)
// }
