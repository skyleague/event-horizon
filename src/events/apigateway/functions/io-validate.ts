import type { Try } from '@skyleague/axioms'
import { EventError } from '../../../errors/event-error/event-error.js'
import type { HTTPEventHandler, HTTPRequest } from '../types.js'

export function httpIOValidate<Handler extends HTTPEventHandler>() {
    return {
        before: (http: Handler, event: HTTPRequest): Try<HTTPRequest> => {
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

            return event as HTTPRequest
        },
    }
}
