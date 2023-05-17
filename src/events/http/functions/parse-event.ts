import { parseJSON } from '../../../parsers/index.js'
import type { HTTPEventHandler, HTTPRequest } from '../types.js'

import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export function httpParseEvent({ bodyType = 'json' }: HTTPEventHandler) {
    return {
        before: (event: APIGatewayProxyEvent | APIGatewayProxyEventV2): HTTPRequest => {
            let body: unknown = event.body
            if (bodyType !== 'binary' && isString(event.body)) {
                const unencodedBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body
                body = bodyType === 'json' ? parseJSON(unencodedBody) : unencodedBody
            }
            // headers on the event may be undefined due to test events fron the AWS console
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
