import type { HttpEventHandler, HttpRequest } from '../../events/http/types'

import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export function httpParseEvent({ bodyType = 'json' }: HttpEventHandler) {
    return {
        before: (event: APIGatewayProxyEvent | APIGatewayProxyEventV2): HttpRequest => {
            let body: unknown = event.body
            if (bodyType !== 'binary' && isString(event.body)) {
                const unencodedBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body
                body = bodyType === 'json' ? JSON.parse(unencodedBody) : unencodedBody
            }
            return {
                body,
                headers: event.headers,
                query: event.queryStringParameters ?? undefined,
                path: event.pathParameters ?? undefined,
                raw: event as HttpRequest['raw'],
            }
        },
    }
}