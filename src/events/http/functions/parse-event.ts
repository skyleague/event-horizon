import type { HTTPEventHandler, HTTPRequest } from '../types'

import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export function httpParseEvent({ bodyType = 'json' }: HTTPEventHandler) {
    return {
        before: (event: APIGatewayProxyEvent | APIGatewayProxyEventV2): HTTPRequest => {
            let body: unknown = event.body
            if (bodyType !== 'binary' && isString(event.body)) {
                const unencodedBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body
                body = bodyType === 'json' ? JSON.parse(unencodedBody) : unencodedBody
            }
            const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([h, v]) => [h.toLowerCase(), v]))

            return {
                body,
                headers,
                query: event.queryStringParameters ?? {},
                path: event.pathParameters ?? {},
                raw: event as HTTPRequest['raw'],
            }
        },
    }
}
