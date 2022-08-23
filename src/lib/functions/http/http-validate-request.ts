import type { HttpEventHandler, HttpRequest } from '../../events/http/types'

import type { Either } from '@skyleague/axioms'
import type { ErrorObject } from 'ajv'

export function httpValidateRequest() {
    return {
        before: (http: HttpEventHandler, event: HttpRequest): Either<ErrorObject[], HttpRequest> => {
            if (http.body?.is(event.body) === false) {
                return { left: http.body.validate.errors ?? [] }
            }
            return {
                right: {
                    body: event.body,
                    headers: event.headers,
                    query: event.query,
                    path: event.path,
                    raw: event.raw,
                },
            }
        },
    }
}
