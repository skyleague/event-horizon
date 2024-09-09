import type { Try } from '@skyleague/axioms'
import { EventError } from '../../../../errors/event-error/event-error.js'
import type { EventFromHandler } from '../../../types.js'
import type { HTTPEventHandler, HTTPRequest } from '../types.js'

export function httpIOValidate<Handler extends HTTPEventHandler>(http: Handler) {
    return {
        before: (event: HTTPRequest): Try<EventFromHandler<Handler>> => {
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

            if (http.schema.authorizer !== undefined) {
                if ('jwt' in http.schema.authorizer && http.schema.authorizer.jwt !== true && 'claims' in event.authorizer) {
                    if (http.schema.authorizer.jwt.is(event.authorizer.claims) === false) {
                        return EventError.validation({ errors: http.schema.authorizer.jwt.errors, location: 'authorizer.jwt' })
                    }
                }
                if ('lambda' in http.schema.authorizer && http.schema.authorizer.lambda !== true) {
                    if (http.schema.authorizer.lambda.is(event.authorizer) === false) {
                        return EventError.validation({
                            errors: http.schema.authorizer.lambda.errors,
                            location: 'authorizer.lambda',
                        })
                    }
                }
            }

            return event as EventFromHandler<Handler>
        },
    }
}
