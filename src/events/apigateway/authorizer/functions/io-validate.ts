import type { Try } from '@skyleague/axioms'
import { EventError } from '../../../../errors/event-error/event-error.js'
import type { EventFromHandler } from '../../../types.js'
import type { RequestAuthorizerEvent, RequestAuthorizerEventHandler } from '../types.js'

export function authorizerIOValidate<Handler extends RequestAuthorizerEventHandler>(http: Handler) {
    return {
        before: (event: RequestAuthorizerEvent): Try<EventFromHandler<Handler>> => {
            if (http.schema?.query?.is(event.query) === false) {
                return EventError.validation({ errors: http.schema.query.errors, location: 'query' })
            }
            if (http.schema?.path?.is(event.path) === false) {
                return EventError.validation({ errors: http.schema.path.errors, location: 'path' })
            }
            if (http.schema?.headers?.is(event.headers) === false) {
                return EventError.validation({ errors: http.schema.headers.errors, location: 'headers' })
            }

            return event as EventFromHandler<Handler>
        },
    }
}
