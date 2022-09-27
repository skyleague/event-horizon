import type { HttpEventHandler, HttpRequest } from '../types'

import type { ErrorObject } from 'ajv'

export function httpIOValidate() {
    return {
        before: (http: HttpEventHandler, event: HttpRequest): { left: ErrorObject[]; in: string } | { right: HttpRequest } => {
            if (http.schema.body?.is(event.body) === false) {
                return { left: http.schema.body.validate.errors ?? [], in: 'body' }
            }
            if (http.schema.query?.is(event.query) === false) {
                return { left: http.schema.query.validate.errors ?? [], in: 'query' }
            }
            if (http.schema.pathParams?.is(event.pathParams) === false) {
                return { left: http.schema.pathParams.validate.errors ?? [], in: 'path' }
            }
            if (http.schema.headers?.is(event.headers) === false) {
                return { left: http.schema.headers.validate.errors ?? [], in: 'headers' }
            }

            return {
                right: event,
            }
        },
    }
}
