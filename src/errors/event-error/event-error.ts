/* eslint-disable @typescript-eslint/naming-convention */

import type { HttpHeaders, HttpMethod } from '../../events/http/types'

import type { UndefinedFields } from '@skyleague/axioms'
import { asArray, isError } from '@skyleague/axioms'

const httpStatusCodes: Record<number, string | undefined> = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    103: 'Early Hints',

    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    208: 'Already Reported',
    226: 'IM Used',

    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',

    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a teapot",
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Too Early',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    444: 'No Response',
    449: 'Retryable',
    451: 'Unavailable For Legal Reasons',

    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    508: 'Loop Detected',
    509: 'Bandwidth Limit Exceeded',
    510: 'Not Extended',
    511: 'Network Authentication Required',
}

export type ErrorLike = Error | string

export interface EventErrorOptions {
    expose?: boolean
    headers?: HttpHeaders
    statusCode?: number
    attributes?: Record<string, unknown>
    cause?: unknown
}

export class EventError extends Error {
    public isEventError = true
    public expose: boolean
    public headers: HttpHeaders | undefined
    public message: string
    public statusCode: number
    public attributes: Record<string, unknown> | undefined

    public constructor(
        message?: ErrorLike,
        { expose, headers, statusCode = 500, attributes, cause }: UndefinedFields<EventErrorOptions> = {}
    ) {
        super(isError(message) ? message.message : message, isError(message) ? { cause: message } : undefined)

        this.statusCode = statusCode
        this.expose = expose ?? this.statusCode < 500
        this.headers = headers
        this.attributes = attributes
        this.name = httpStatusCodes[this.statusCode] ?? 'Unknown'
        this.cause = cause
        if (isError(message)) {
            this.message = message.message
            this.name = message.name
            if (message.stack !== undefined) {
                this.stack = message.stack
            }
        } else {
            this.message = message ?? this.name
        }
    }

    public static is<O>(e: EventError | O): e is EventError {
        return e instanceof Error && 'isEventError' in e && e.isEventError === true
    }

    public static badRequest(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 400, attributes, cause })
    }

    public static unauthorized(message: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 401, attributes, cause })
    }

    public static paymentRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 402, attributes, cause })
    }

    public static forbidden(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 403, attributes, cause })
    }

    public static notFound(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 404, attributes, cause })
    }

    public static methodNotAllowed({
        allow,
        message,
        attributes,
        cause,
    }: {
        allow: HttpMethod[]
        message?: ErrorLike
        attributes?: Record<string, unknown>
        cause?: unknown
    }): EventError {
        return new EventError(message, {
            statusCode: 405,
            attributes,
            headers: {
                Allow: asArray(allow).join(', '),
            },
            cause,
        })
    }

    public static notAcceptable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 406, attributes, cause })
    }

    public static proxyAuthRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 407, attributes, cause })
    }

    public static requestTimeout(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 408, attributes, cause })
    }

    public static conflict(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 409, attributes, cause })
    }

    public static gone(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 410, attributes, cause })
    }

    public static lengthRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 411, attributes, cause })
    }

    public static preconditionFailed(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 412, attributes, cause })
    }

    public static payloadTooLarge(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 413, attributes, cause })
    }

    public static uriTooLong(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 414, attributes, cause })
    }

    public static unsupportedMediaType(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 415, attributes, cause })
    }

    public static rangeNotSatisfiable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 416, attributes, cause })
    }

    public static expectationFailed(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 417, attributes, cause })
    }

    public static teapot(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 418, attributes, cause })
    }

    public static unprocessableEntity(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 422, attributes, cause })
    }

    public static locked(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 423, attributes, cause })
    }

    public static failedDependency(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 424, attributes, cause })
    }

    public static tooEarly(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 425, attributes, cause })
    }

    public static preconditionRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 428, attributes, cause })
    }

    public static tooManyRequests(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 429, attributes, cause })
    }

    public static noResponse(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 444, attributes, cause })
    }

    public static unavailableForLegalReasons(
        message?: ErrorLike,
        attributes?: Record<string, unknown>,
        cause?: unknown
    ): EventError {
        return new EventError(message, { statusCode: 451, attributes, cause })
    }

    public static retryable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 449, attributes, cause })
    }

    public static internal(
        message?: ErrorLike,
        { expose, headers, statusCode = 500, attributes, cause }: UndefinedFields<EventErrorOptions> = {}
    ): EventError {
        return new EventError(message, { expose, headers, statusCode, attributes, cause })
    }

    public static internalServerError(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 500, attributes, cause })
    }

    public static notImplemented(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 501, attributes, cause })
    }

    public static badGateway(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 502, attributes, cause })
    }

    public static serviceUnavailable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 503, attributes, cause })
    }

    public static gatewayTimeout(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 504, attributes, cause })
    }

    public static loopDetected(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 508, attributes, cause })
    }
}
