import { parseJSON } from '../../../parsers/json/json.js'
import type { GatewayVersion, HTTPEventHandler, HTTPRequest } from '../types.js'

import { isString } from '@skyleague/axioms'
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2 } from 'aws-lambda'

export function httpParseEvent<
    Configuration,
    Service,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result,
    GV extends GatewayVersion = 'http',
>({ bodyType = 'json' }: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>) {
    return {
        before: (event: APIGatewayProxyEvent | APIGatewayProxyEventV2): HTTPRequest => {
            let body: unknown = event.body
            if (bodyType !== 'binary' && isString(event.body)) {
                const unencodedBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body
                body = bodyType === 'json' ? parseJSON(unencodedBody) : unencodedBody
            }
            // headers on the event may be undefined due to test events from the AWS console
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
