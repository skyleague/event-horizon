import type { HttpEventHandler, HttpRequest } from '../../events/http/types'

import type { Either } from '@skyleague/axioms'
import type { ErrorObject } from 'ajv'

export function httpValidateRequest() {
    return {
        before: (http: HttpEventHandler, event: HttpRequest): Either<ErrorObject[], HttpRequest> => {
            if (http.schema.body?.is(event.body) === false) {
                return { left: http.schema.body.validate.errors ?? [] }
            }
            return {
                right: {
                    body: event.body,
                    headers: event.headers,
                    query: event.query,
                    pathParams: event.pathParams,
                    raw: event.raw,
                },
            }
        },
    }
}
