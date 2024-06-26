import type { Schema } from '@skyleague/therefore/src/types/openapi.type.js'
import { serviceConstants } from '../../../constants.js'


export interface HttpError {
    statusCode: number
    message: string
    stack?: string
}

export const HttpError = {
    get schema(): Schema {
        return {
            type: 'object',
            title: 'Default Error Response',
            description: 'The default error error response for both 400 & 500 type errors',
            properties: {
                statusCode: { type: 'integer', description: 'The status code of the response.' },
                message: { type: 'string', description: 'A detailed message of the error.' },
                ...(serviceConstants.isDebug
                    ? { stack: { type: 'string', description: 'When debugging is enabled, a stack trace is exposed.' } }
                    : {}),
            },
            required: ['statusCode', 'message'] as [string, ...string[]],
        } as const
    },
} as const
