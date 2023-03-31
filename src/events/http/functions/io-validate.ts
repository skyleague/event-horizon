import { EventError } from '../../../errors/index.js'
import type { HTTPEventHandler, HTTPRequest } from '../types.js'

import type { Try } from '@skyleague/axioms'

export function httpIOValidate() {
    return {
        before: (http: HTTPEventHandler, event: HTTPRequest): Try<HTTPRequest> => {
            if (http.schema.body?.is(event.body) === false) {
                return EventError.validation({ errors: http.schema.body.errors, location: 'body' })
            }
            if (http.schema.query?.is(event.query) === false) {
                return EventError.validation({ errors: http.schema.query.errors, location: 'query' })
            }
            if (http.schema.path?.is(event.path) === false) {
                return EventError.validation({ errors: http.schema.path.errors, location: 'path' })
            }
            if (http.schema.headers?.is(event.headers) === false) {
                return EventError.validation({ errors: http.schema.headers.errors, location: 'headers' })
            }

            return event
        },
    }
}
