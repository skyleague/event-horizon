/**
 * The default error error response for both 400 & 500 type errors
 */
export interface HttpError {
    /**
     * The status code of the response.
     */
    statusCode: number
    /**
     * A detailed message of the error.
     */
    message: string
}

export const HttpError = {
    is: (o: unknown): o is HttpError => {
        return typeof o === 'object' && o !== null && 'statusCode' in o && 'message' in o
    },
    schema: {
        type: 'object',
        title: 'HttpError',
        properties: {
            statusCode: {
                type: 'integer',
                description: 'The status code of the response.',
            },
            message: {
                type: 'string',
                description: 'A detailed message of the error.',
            },
        },
        description: 'The default error error response for both 400 & 500 type errors',
        required: ['statusCode', 'message'],
        additionalProperties: true,
    },
} as const
