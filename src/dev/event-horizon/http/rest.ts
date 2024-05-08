import type { Dependent } from '@skyleague/axioms'
import { constant, object } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { HTTPHandler, HTTPRequest } from '../../../events/http/types.js'
import { APIGatewayProxyEventSchema } from '../../aws/apigateway/rest.type.js'

export function restApiEvent<Configuration, Service, Profile, Body, Path, Query, Headers, Result>(
    { http }: HTTPHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, 'rest'>,
    { generation = 'fast' }: { generation?: 'full' | 'fast' } = {},
): Dependent<HTTPRequest<Body, Path, Query, Headers, 'rest'>> {
    const { bodyType = 'json' } = http

    const body = http.schema.body !== undefined ? arbitrary(http.schema.body) : constant(undefined)
    const headers = http.schema.headers !== undefined ? arbitrary(http.schema.headers) : constant(undefined)
    const query = http.schema.query !== undefined ? arbitrary(http.schema.query) : constant(undefined)
    const path = http.schema.path !== undefined ? arbitrary(http.schema.path) : constant(undefined)
    const raw = arbitrary(APIGatewayProxyEventSchema).constant(generation === 'fast')

    return raw.chain((r) => {
        return object({
            body,
            headers,
            query,
            path,
            raw: constant(r),
        }).map((event) => {
            // force coercion
            http.schema.body?.is?.(event.body) ?? true
            http.schema.headers?.is?.(event.headers) ?? true
            http.schema.query?.is?.(event.query) ?? true
            http.schema.path?.is?.(event.path) ?? true

            if (bodyType !== 'binary') {
                const eventBody = event.body ?? event.raw.body
                const b = (bodyType === 'json' ? JSON.stringify(eventBody ?? '') : eventBody) ?? ''
                event.raw.body = (
                    event.raw.isBase64Encoded === true ? Buffer.from(b.toString()).toString('base64') : b
                ) as typeof event.raw.body
            }

            event.raw.headers ??= (event.headers as typeof event.raw.headers) ?? {}
            event.raw.queryStringParameters ??= (event.query as typeof event.raw.queryStringParameters) ?? {}

            return {
                ...event,
                get raw() {
                    return event.raw
                },
            } as HTTPRequest<Body, Path, Query, Headers, 'rest'>
        })
    })
}
