import { asArray, isError, isThrown } from '@skyleague/axioms'
import type { ErrorObject } from 'ajv'
import type { HTTPHeaders, HTTPMethod } from '../../events/http/types.js'
import type { Logger } from '../../observability/logger/logger.js'

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

/**
 * @group Errors
 */
export interface EventOptions {
    level?: 'error' | 'info' | 'warning' | undefined
    errorHandling?: 'graceful' | 'throw' | undefined
    expose?: boolean | undefined
    headers?: HTTPHeaders | undefined
    statusCode?: number | undefined
    attributes?: Record<string, unknown> | undefined
    cause?: unknown | undefined
    // biome-ignore lint/complexity/noBannedTypes: ctor is as generic as it gets
    ctor?: Function | undefined
    name?: string | undefined
}

/**
 * @group Errors
 */
export class EventError extends Error {
    public isEventError = true
    public forceLevel: 'error' | 'info' | 'warning' | undefined
    public thrown: boolean
    public original: unknown
    public errorHandling: 'graceful' | 'throw'
    public error: string
    public expose: boolean
    public headers: HTTPHeaders | undefined
    public override message: string
    public statusCode: number
    public attributes: Record<string, unknown> | undefined

    public constructor(
        message?: ErrorLike,
        {
            expose,
            headers,
            statusCode = 500,
            attributes,
            cause,
            level,
            errorHandling,
            ctor = EventError,
            name,
        }: EventOptions = {},
    ) {
        super(isError(message) ? message.message : message, isError(message) ? { cause: message } : undefined)
        // cleanup stack trace
        Error.captureStackTrace(this, ctor)

        this.thrown = isThrown(message)
        this.statusCode = statusCode
        this.expose = expose ?? this.statusCode < 500
        this.headers = headers
        this.attributes = attributes
        this.error = httpStatusCodes[this.statusCode] ?? 'Unknown'
        this.name = name ?? ctor.name
        this.cause = cause
        this.forceLevel = level
        this.errorHandling = errorHandling ?? 'throw'
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

    public get level(): 'error' | 'info' | 'warning' {
        return (
            this.forceLevel ??
            (this.thrown || isThrown(this) ? 'error' : this.isServerError ? 'error' : this.isClientError ? 'warning' : 'info')
        )
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

    public static log(logger: Logger, error: EventError | unknown, mode: 'error' | 'level' = 'level'): EventError {
        const eventError = EventError.from(error)
        if (mode === 'level') {
            if (eventError.level === 'error') {
                logger.error(eventError.message, eventError)
            } else if (eventError.level === 'warning') {
                logger.warn(eventError.message, eventError)
            } else {
                logger.info(eventError.message, eventError)
            }
        } else {
            logger.error(eventError.message, eventError)
        }

        return eventError
    }

    public static from(error: EventError | unknown): EventError {
        return EventError.is(error)
            ? error
            : isError(error)
              ? new EventError(error, { cause: error, ctor: EventError.from, name: 'EventError' })
              : new EventError('unknown', { cause: error, ctor: EventError.from, name: 'EventError' })
    }

    public static validation(
        options: EventOptions & {
            errors?: ErrorObject[] | null | undefined
            location?: string
        } = {},
    ): EventError {
        const { errors, location, statusCode = 400 } = options
        const message =
            location !== undefined ? `${errors?.[0]?.message ?? 'validation failed'} in ${location}` : errors?.[0]?.message
        return new EventError(message, {
            statusCode,
            attributes: { ...options.attributes, location, errors },
            ctor: EventError.validation,
            ...options,
        })
    }

    public static badRequest(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, {
            statusCode: 400,
            ctor: EventError.badRequest,
            ...options,
        })
    }

    public static unauthorized(message: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 401, ctor: EventError.unauthorized, ...options })
    }

    public static paymentRequired(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 402, ctor: EventError.paymentRequired, ...options })
    }

    public static forbidden(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 403, ctor: EventError.forbidden, ...options })
    }

    public static notFound(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 404, ctor: EventError.notFound, ...options })
    }

    public static methodNotAllowed(
        options: EventOptions & {
            allow: HTTPMethod[]
            message?: ErrorLike
        },
    ): EventError {
        const { allow, message } = options
        return new EventError(message, {
            statusCode: 405,
            headers: {
                Allow: asArray(allow).join(', '),
                ...options.headers,
            },
            ctor: EventError.methodNotAllowed,
            ...options,
        })
    }

    public static notAcceptable(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 406, ctor: EventError.notAcceptable, ...options })
    }

    public static proxyAuthRequired(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 407, ctor: EventError.proxyAuthRequired, ...options })
    }

    public static requestTimeout(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 408, ctor: EventError.requestTimeout, ...options })
    }

    public static conflict(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 409, ctor: EventError.conflict, ...options })
    }

    public static gone(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 410, ctor: EventError.gone, ...options })
    }

    public static lengthRequired(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 411, ctor: EventError.lengthRequired, ...options })
    }

    public static preconditionFailed(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 412, ctor: EventError.preconditionFailed, ...options })
    }

    public static payloadTooLarge(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 413, ctor: EventError.payloadTooLarge, ...options })
    }

    public static uriTooLong(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 414, ctor: EventError.uriTooLong, ...options })
    }

    public static unsupportedMediaType(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 415, ctor: EventError.unsupportedMediaType, ...options })
    }

    public static rangeNotSatisfiable(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 416, ctor: EventError.rangeNotSatisfiable, ...options })
    }

    public static expectationFailed(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 417, ctor: EventError.expectationFailed, ...options })
    }

    public static teapot(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 418, ctor: EventError.teapot, ...options })
    }

    public static unprocessableEntity(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 422, ctor: EventError.unprocessableEntity, ...options })
    }

    public static locked(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 423, ctor: EventError.locked, ...options })
    }

    public static failedDependency(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 424, ctor: EventError.failedDependency, ...options })
    }

    public static tooEarly(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 425, ctor: EventError.tooEarly, ...options })
    }

    public static preconditionRequired(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 428, ctor: EventError.preconditionRequired, ...options })
    }

    public static tooManyRequests(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 429, ctor: EventError.tooManyRequests, ...options })
    }

    public static noResponse(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 444, ctor: EventError.noResponse, ...options })
    }

    public static unavailableForLegalReasons(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 451, ctor: EventError.unavailableForLegalReasons, ...options })
    }

    public static retryable(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 449, ctor: EventError.retryable, ...options })
    }

    public static internal(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 500, ctor: EventError.internal, ...options })
    }

    public static internalServerError(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 500, ctor: EventError.internalServerError, ...options })
    }

    public static notImplemented(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 501, ctor: EventError.notImplemented, ...options })
    }

    public static unexpectedEventType(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message ?? 'Lambda was invoked with an unexpected event type', {
            statusCode: 501,
            ctor: EventError.unexpectedEventType,
            ...options,
        })
    }

    public static badGateway(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 502, ctor: EventError.badGateway, ...options })
    }

    public static serviceUnavailable(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 503, ctor: EventError.serviceUnavailable, ...options })
    }

    public static gatewayTimeout(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 504, ctor: EventError.gatewayTimeout, ...options })
    }

    public static loopDetected(message?: ErrorLike, options: EventOptions = {}): EventError {
        return new EventError(message, { statusCode: 508, ctor: EventError.loopDetected, ...options })
    }
}
