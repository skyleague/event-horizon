import { EventError, httpStatusCodes } from './event-error.js'

import { constants, asTry, forAll, integer, string, tuple } from '@skyleague/axioms'
import { expect, it } from 'vitest'

it('EventError === EventError', () => {
    expect(EventError.is(EventError.badGateway())).toBe(true)
})

it.each([
    [EventError.badRequest, 400],
    [EventError.unauthorized, 401],
    [EventError.paymentRequired, 402],
    [EventError.forbidden, 403],
    [EventError.notFound, 404],
    [EventError.notAcceptable, 406],
    [EventError.proxyAuthRequired, 407],
    [EventError.requestTimeout, 408],
    [EventError.conflict, 409],
    [EventError.gone, 410],
    [EventError.lengthRequired, 411],
    [EventError.preconditionFailed, 412],
    [EventError.payloadTooLarge, 413],
    [EventError.uriTooLong, 414],
    [EventError.unsupportedMediaType, 415],
    [EventError.rangeNotSatisfiable, 416],
    [EventError.expectationFailed, 417],
    [EventError.teapot, 418],
    [EventError.unprocessableEntity, 422],
    [EventError.locked, 423],
    [EventError.failedDependency, 424],
    [EventError.tooEarly, 425],
    [EventError.preconditionRequired, 428],
    [EventError.tooManyRequests, 429],
    [EventError.noResponse, 444],
    [EventError.unavailableForLegalReasons, 451],
    [EventError.retryable, 449],
    [EventError.internal, 500],
    [EventError.internalServerError, 500],
    [EventError.notImplemented, 501],
    [EventError.badGateway, 502],
    [EventError.serviceUnavailable, 503],
    [EventError.gatewayTimeout, 504],
    [EventError.loopDetected, 508],
])('event $error', (error, statusCode) => {
    forAll(string(), (message) => {
        const e = error(message)
        expect(e).toBeInstanceOf(EventError)
        expect(e).toEqual(expect.any(EventError))
        expect(EventError.is(e)).toBeTruthy()
        expect(e.statusCode).toEqual(statusCode)
        expect(e.name).toEqual(error.name)
        expect(e.error).toEqual(httpStatusCodes[statusCode])
        expect(e.stack).not.toMatch(/\/event-error\.ts/)

        expect(e.isInformational).toEqual(e.statusCode.toString().startsWith('1'))
        expect(e.isSuccess).toEqual(e.statusCode.toString().startsWith('2'))
        expect(e.isRedirection).toEqual(e.statusCode.toString().startsWith('3'))
        expect(e.isClientError).toEqual(e.statusCode.toString().startsWith('4'))
        expect(e.isServerError).toEqual(e.statusCode.toString().startsWith('5'))
    })
})

it('validation', () => {
    const e = EventError.validation({})
    expect(e).toBeInstanceOf(EventError)
    expect(e).toEqual(expect.any(EventError))
    expect(EventError.is(e)).toBeTruthy()
    expect(e.statusCode).toEqual(400)
    expect(e.name).toEqual('validation')
    expect(e.error).toEqual(httpStatusCodes[400])
    expect(e.stack).not.toMatch(/\/event-error\.ts/)
})

it('methodNotAllowed', () => {
    const e = EventError.methodNotAllowed({ allow: ['get'] })
    expect(e).toBeInstanceOf(EventError)
    expect(e).toEqual(expect.any(EventError))
    expect(EventError.is(e)).toBeTruthy()
    expect(e.statusCode).toEqual(405)
    expect(e.name).toEqual('methodNotAllowed')
    expect(e.error).toEqual(httpStatusCodes[405])
    expect(e.stack).not.toMatch(/\/event-error\.ts/)
})

it('level - server error is error', () => {
    forAll(integer({ min: 500, max: 599 }), (statusCode) => {
        expect(new EventError(undefined, { statusCode }).level).toBe('error')
    })
})

it('level - thrown try errors default to error', () => {
    expect(
        (
            asTry((): EventError => {
                throw EventError.expectationFailed(undefined)
            }) as EventError
        ).level,
    ).toMatchInlineSnapshot('"error"')
})

it('level - client error is warning', () => {
    forAll(integer({ min: 400, max: 499 }), (statusCode) => {
        expect(new EventError(undefined, { statusCode }).level).toBe('warning')
    })
})

it('level - other error is info', () => {
    forAll(integer({ min: 0, max: 399 }), (statusCode) => {
        expect(new EventError(undefined, { statusCode }).level).toBe('info')
    })
})

it('level - level overrides default', () => {
    forAll(tuple(integer({ min: 0, max: 600 }), constants('warning', 'info', 'error')), ([statusCode, level]) => {
        expect(new EventError(undefined, { statusCode, level }).level).toBe(level)
    })
})
