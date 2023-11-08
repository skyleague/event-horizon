import { EventError } from '../../errors/index.js'

import { PowertoolLogFormatter } from '@aws-lambda-powertools/logger'
import type { LogAttributes } from '@aws-lambda-powertools/logger/lib/types'

export class LogFormatter extends PowertoolLogFormatter {
    public override formatError(error: Error | EventError): LogAttributes {
        const formatted = super.formatError(error)
        if (EventError.is(error)) {
            return {
                ...formatted,
                attributes: error.attributes,
                headers: error.headers,
                statusCode: error.statusCode,
            }
        }
        return formatted
    }
}
