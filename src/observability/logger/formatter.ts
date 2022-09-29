import { EventError } from '../../errors'

import { PowertoolLogFormatter } from '@aws-lambda-powertools/logger'
import type { LogAttributes } from '@aws-lambda-powertools/logger/lib/types'
import { isError } from '@skyleague/axioms'

export class LogFormatter extends PowertoolLogFormatter {
    public formatError(error: Error | EventError): LogAttributes {
        const formatted = super.formatError(error)
        if (EventError.is(error)) {
            return {
                ...formatted,
                attributes: error.attributes,
                headers: error.headers,
                statusCode: error.statusCode,
                cause: isError(error.cause) ? this.formatError(error.cause) : error.cause,
            }
        }
        return { ...formatted, cause: isError(error.cause) ? this.formatError(error.cause) : error.cause }
    }
}
