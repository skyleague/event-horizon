/* eslint-disable @typescript-eslint/unbound-method */

import type { HTTPHeaders, HTTPMethod } from '../../events/http/types'

import type { UndefinedFields } from '@skyleague/axioms'
import { asArray, isError } from '@skyleague/axioms'
import type { ErrorObject } from 'ajv'

export const httpStatusCodes: Record<number, string | undefined> = {
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
    headers?: HTTPHeaders
    statusCode?: number
    attributes?: Record<string, unknown>
    cause?: unknown
    // eslint-disable-next-line @typescript-eslint/ban-types
    ctor?: Function
}

export class EventError extends Error {
    public isEventError = true
    public error: string
    public expose: boolean
    public headers: HTTPHeaders | undefined
    public message: string
    public statusCode: number
    public attributes: Record<string, unknown> | undefined

    public constructor(
        message?: ErrorLike,
        { expose, headers, statusCode = 500, attributes, cause, ctor = EventError }: UndefinedFields<EventErrorOptions> = {}
    ) {
        super(isError(message) ? message.message : message, isError(message) ? { cause: message } : undefined)
        Error.captureStackTrace(this, ctor)
        // cleanup stack trace
        this.statusCode = statusCode
        this.expose = expose ?? this.statusCode < 500
        this.headers = headers
        this.attributes = attributes
        this.error = httpStatusCodes[this.statusCode] ?? 'Unknown'
        this.name = ctor.name
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

    public get isInformational(): boolean {
        return this.statusCode >= 100 && this.statusCode < 200
    }

    public get isSuccess(): boolean {
        return this.statusCode >= 200 && this.statusCode < 300
    }

    public get isRedirection(): boolean {
        return this.statusCode >= 300 && this.statusCode < 400
    }

    public get isClientError(): boolean {
        return this.statusCode >= 400 && this.statusCode < 500
    }

    public get isServerError(): boolean {
        return this.statusCode >= 500 && this.statusCode < 600
    }

    public static is<O>(e: EventError | O): e is EventError {
        return e instanceof Error && 'isEventError' in e && e.isEventError
    }

    public static validation({
        errors,
        location,
        attributes,
        cause,
        statusCode = 400,
    }: {
        errors?: ErrorObject[] | null | undefined
        location?: string
        attributes?: Record<string, unknown>
        cause?: unknown
        statusCode?: number
    } = {}): EventError {
        const message =
            location !== undefined ? `${errors?.[0]?.message ?? 'validation failed'} in ${location}` : errors?.[0]?.message
        return new EventError(message, {
            statusCode,
            attributes: { ...attributes, location, errors },
            cause,
            ctor: EventError.validation,
        })
    }

    public static badRequest(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, {
            statusCode: 400,
            attributes,
            cause,
            ctor: EventError.badRequest,
        })
    }

    public static unauthorized(message: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 401, attributes, cause, ctor: EventError.unauthorized })
    }

    public static paymentRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 402, attributes, cause, ctor: EventError.paymentRequired })
    }

    public static forbidden(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 403, attributes, cause, ctor: EventError.forbidden })
    }

    public static notFound(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 404, attributes, cause, ctor: EventError.notFound })
    }

    public static methodNotAllowed({
        allow,
        message,
        attributes,
        cause,
    }: {
        allow: HTTPMethod[]
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
            ctor: EventError.methodNotAllowed,
        })
    }

    public static notAcceptable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 406, attributes, cause, ctor: EventError.notAcceptable })
    }

    public static proxyAuthRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 407, attributes, cause, ctor: EventError.proxyAuthRequired })
    }

    public static requestTimeout(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 408, attributes, cause, ctor: EventError.requestTimeout })
    }

    public static conflict(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 409, attributes, cause, ctor: EventError.conflict })
    }

    public static gone(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 410, attributes, cause, ctor: EventError.gone })
    }

    public static lengthRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 411, attributes, cause, ctor: EventError.lengthRequired })
    }

    public static preconditionFailed(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 412, attributes, cause, ctor: EventError.preconditionFailed })
    }

    public static payloadTooLarge(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 413, attributes, cause, ctor: EventError.payloadTooLarge })
    }

    public static uriTooLong(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 414, attributes, cause, ctor: EventError.uriTooLong })
    }

    public static unsupportedMediaType(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 415, attributes, cause, ctor: EventError.unsupportedMediaType })
    }

    public static rangeNotSatisfiable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 416, attributes, cause, ctor: EventError.rangeNotSatisfiable })
    }

    public static expectationFailed(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 417, attributes, cause, ctor: EventError.expectationFailed })
    }

    public static teapot(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 418, attributes, cause, ctor: EventError.teapot })
    }

    public static unprocessableEntity(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 422, attributes, cause, ctor: EventError.unprocessableEntity })
    }

    public static locked(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 423, attributes, cause, ctor: EventError.locked })
    }

    public static failedDependency(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 424, attributes, cause, ctor: EventError.failedDependency })
    }

    public static tooEarly(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 425, attributes, cause, ctor: EventError.tooEarly })
    }

    public static preconditionRequired(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 428, attributes, cause, ctor: EventError.preconditionRequired })
    }

    public static tooManyRequests(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 429, attributes, cause, ctor: EventError.tooManyRequests })
    }

    public static noResponse(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 444, attributes, cause, ctor: EventError.noResponse })
    }

    public static unavailableForLegalReasons(
        message?: ErrorLike,
        attributes?: Record<string, unknown>,
        cause?: unknown
    ): EventError {
        return new EventError(message, { statusCode: 451, attributes, cause, ctor: EventError.unavailableForLegalReasons })
    }

    public static retryable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 449, attributes, cause, ctor: EventError.retryable })
    }

    public static internal(
        message?: ErrorLike,
        { expose, headers, statusCode = 500, attributes, cause }: UndefinedFields<EventErrorOptions> = {}
    ): EventError {
        return new EventError(message, { expose, headers, statusCode, attributes, cause, ctor: EventError.internal })
    }

    public static internalServerError(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 500, attributes, cause, ctor: EventError.internalServerError })
    }

    public static notImplemented(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 501, attributes, cause, ctor: EventError.notImplemented })
    }

    public static badGateway(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 502, attributes, cause, ctor: EventError.badGateway })
    }

    public static serviceUnavailable(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 503, attributes, cause, ctor: EventError.serviceUnavailable })
    }

    public static gatewayTimeout(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 504, attributes, cause, ctor: EventError.gatewayTimeout })
    }

    public static loopDetected(message?: ErrorLike, attributes?: Record<string, unknown>, cause?: unknown): EventError {
        return new EventError(message, { statusCode: 508, attributes, cause, ctor: EventError.loopDetected })
    }
}
