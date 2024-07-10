import type { APIGatewayProxyEventV2Schema } from '../../../aws/apigateway/http.type.js'
import type { APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'
import { parseJSON } from '../../../parsers/json/json.js'
import type { GatewayVersion, HTTPEventHandler, HTTPRequest } from '../types.js'

import { isString } from '@skyleague/axioms'

export function httpParseEvent<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV extends GatewayVersion>({
    bodyType = 'json',
}: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>) {
    return {
        before: (event: APIGatewayProxyEventV2Schema | APIGatewayProxyEventSchema): HTTPRequest => {
            let body: unknown = event.body
            if (bodyType !== 'binary' && isString(event.body)) {
                const unencodedBody = event.isBase64Encoded === true ? Buffer.from(event.body, 'base64').toString() : event.body
                body = bodyType === 'json' ? parseJSON(unencodedBody) : unencodedBody
            }
            // headers on the event may be undefined due to test events from the AWS console
            const headers = Object.fromEntries(Object.entries(event.headers ?? {}).map(([h, v]) => [h.toLowerCase(), v]))

            return {
                body,
                headers,
                query: event.queryStringParameters ?? {},
                path: event.pathParameters ?? {},
                raw: event satisfies HTTPRequest['raw'],
            }
        },
    }
}
