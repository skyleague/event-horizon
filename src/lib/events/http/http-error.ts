/* eslint-disable @typescript-eslint/naming-convention */
import type { HttpHeaders, HttpMethod } from './types'

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
    449: 'Retry With',
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

export interface HttpErrorOptions {
    expose?: boolean
    headers?: HttpHeaders
    statusCode?: number
    attributes?: Record<string, string>
}

export class HttpError extends Error {
    public isHttpError = true
    public expose: boolean
    public headers: HttpHeaders | undefined
    public message: string
    public statusCode: number
    public attributes: Record<string, string> | undefined

    public constructor(
        message?: ErrorLike,
        { expose, headers, statusCode = 500, attributes }: UndefinedFields<HttpErrorOptions> = {}
    ) {
        super(isError(message) ? message.message : message, isError(message) ? { cause: message } : undefined)

        this.statusCode = statusCode
        this.expose = expose ?? this.statusCode < 500
        this.headers = headers
        this.attributes = attributes
        this.name = httpStatusCodes[this.statusCode] ?? 'Unknown'
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

    public static is<O>(e: HttpError | O): e is HttpError {
        return e instanceof Error && 'isHttpError' in e && e.isHttpError === true
    }

    public static badRequest(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 400, attributes })
    }

    public static unauthorized(message: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 401, attributes })
    }

    public static paymentRequired(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 402, attributes })
    }

    public static forbidden(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 403, attributes })
    }

    public static notFound(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 404, attributes })
    }

    public static methodNotAllowed(allow: HttpMethod[], message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, {
            statusCode: 405,
            attributes,
            headers: {
                Allow: asArray(allow).join(', '),
            },
        })
    }

    public static notAcceptable(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 406, attributes })
    }

    public static proxyAuthRequired(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 407, attributes })
    }

    public static requestTimeout(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 408, attributes })
    }

    public static conflict(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 409, attributes })
    }

    public static gone(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 410, attributes })
    }

    public static lengthRequired(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 411, attributes })
    }

    public static preconditionFailed(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 412, attributes })
    }

    public static payloadTooLarge(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 413, attributes })
    }

    public static uriTooLong(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 414, attributes })
    }

    public static unsupportedMediaType(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 415, attributes })
    }

    public static rangeNotSatisfiable(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 416, attributes })
    }

    public static expectationFailed(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 417, attributes })
    }

    public static teapot(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 418, attributes })
    }

    public static unprocessableEntity(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 422, attributes })
    }

    public static locked(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 423, attributes })
    }

    public static failedDependency(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 424, attributes })
    }

    public static tooEarly(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 425, attributes })
    }

    public static preconditionRequired(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 428, attributes })
    }

    public static tooManyRequests(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 429, attributes })
    }

    public static noResponse(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 444, attributes })
    }

    public static unavailableForLegalReasons(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 451, attributes })
    }

    public static internal(
        message?: ErrorLike,
        { expose, headers, statusCode = 500, attributes }: UndefinedFields<HttpErrorOptions> = {}
    ): HttpError {
        return new HttpError(message, { expose, headers, statusCode, attributes })
    }

    public static notImplemented(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 501, attributes })
    }

    public static badGateway(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 502, attributes })
    }

    public static serviceUnavailable(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 503, attributes })
    }

    public static gatewayTimeout(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 504, attributes })
    }

    public static loopDetected(message?: ErrorLike, attributes?: Record<string, string>): HttpError {
        return new HttpError(message, { statusCode: 508, attributes })
    }
}
