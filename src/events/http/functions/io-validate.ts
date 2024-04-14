import { EventError } from '../../../errors/event-error/event-error.js'
import type { GatewayVersion, HTTPEventHandler, HTTPRequest } from '../types.js'

import type { Try } from '@skyleague/axioms'

export function httpIOValidate<
    Configuration,
    Service,
    Profile,
    Body,
    Path,
    Query,
    Headers,
    Result,
    GV extends GatewayVersion = 'http',
>() {
    return {
        before: (
            http: HTTPEventHandler<Configuration, Service, Profile, Body, Path, Query, Headers, Result, GV>,
            event: HTTPRequest,
        ): Try<HTTPRequest<Body, Path, Query, Headers, GV>> => {
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

            return event as HTTPRequest<Body, Path, Query, Headers, GV>
        },
    }
}
