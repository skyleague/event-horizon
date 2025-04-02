import { constants, alpha, asyncForAll, integer, isString, json, object, random, tuple } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import { httpApiEvent } from '../../../dev/event-horizon/apigateway/event/http.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import { context } from '../../../test/context/context.js'
import { handleHTTPEvent } from './handler.js'
import { httpApiHandler, restApiHandler } from './http.js'

const neverTrue = {
    is: () => false,
    schema: { type: 'object' },
    errors: [],
    // biome-ignore lint/complexity/noBannedTypes: this is a test
} as unknown as Schema<{}>

const method = random(constants('get', 'put'))
const path = `/${random(alpha())}` as const

it.each([httpApiHandler, restApiHandler])('plaintext success does not give failures', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { responses: {} },
            bodyType: 'plaintext',
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 200,
            body: isString(ret) ? ret : JSON.stringify(ret),
            headers: isString(ret) ? {} : { 'Content-Type': 'application/json' },
        })

        expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: req.raw }), ctx)

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            request: expect.any(Object),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `[http] ${handler.http.path} sent 200`, {
            response: {
                statusCode: 200,
            },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([httpApiHandler, restApiHandler])('json success does not give failures', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { responses: {} },
            bodyType: 'json',
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 200,
            body: isString(ret) ? ret : JSON.stringify(ret),
            headers: isString(ret) ? {} : { 'Content-Type': 'application/json' },
        })

        expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: req.raw }), ctx)

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            request: expect.any(Object),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `[http] ${handler.http.path} sent 200`, {
            response: {
                statusCode: 200,
            },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([httpApiHandler, restApiHandler])('binary success does not give failures', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { responses: {} },
            bodyType: 'binary',
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 200,
            body: isString(ret) ? ret : JSON.stringify(ret),
            headers: isString(ret) ? {} : { 'Content-Type': 'application/json' },
        })

        expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: req.raw }), ctx)

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            request: expect.any(Object),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `[http] ${handler.http.path} sent 200`, {
            response: {
                statusCode: 200,
            },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([httpApiHandler, restApiHandler])('body schema validation, gives failure', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { body: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 400,
            body: expect.stringContaining('validation failed in body'),
            headers: { 'Content-Type': 'application/json' },
        })

        expect(h).not.toHaveBeenCalled()

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            error: expect.any(EventError),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([httpApiHandler, restApiHandler])('query schema validation, gives failure', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { query: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 400,
            body: expect.stringContaining('validation failed in query'),
            headers: { 'Content-Type': 'application/json' },
        })

        expect(h).not.toHaveBeenCalled()

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            error: expect.any(EventError),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([httpApiHandler, restApiHandler])('path schema validation, gives failure', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { path: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 400,
            body: expect.stringContaining('validation failed in path'),
            headers: { 'Content-Type': 'application/json' },
        })

        expect(h).not.toHaveBeenCalled()

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            error: expect.any(EventError),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([httpApiHandler, restApiHandler])('headers schema validation, gives failure', async (fn) => {
    const h = vi.fn()
    const handler = (fn as typeof httpApiHandler)({
        http: {
            method,
            path,
            schema: { headers: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpApiEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
        ctx.mockClear()

        h.mockReturnValue({ statusCode: 200, body: ret })
        const response = await handleHTTPEvent(handler, req.raw, ctx)

        expect(response).toEqual({
            statusCode: 400,
            body: expect.stringContaining('validation failed in headers'),
            headers: { 'Content-Type': 'application/json' },
        })

        expect(h).not.toHaveBeenCalled()

        expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
            error: expect.any(EventError),
        })
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([new Error(), EventError.internalServerError(), 'foobar'])(
    '%s - promise reject with Error, gives failure',
    async (error) => {
        const h = vi.fn()
        const handler = httpApiHandler({
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: h,
            },
        })
        await asyncForAll(tuple(httpApiEvent(handler), await context({})), async ([req, ctx]) => {
            ctx.mockClear()

            h.mockRejectedValue(error)
            const response = await handleHTTPEvent(handler, req.raw, ctx)

            expect(response).toEqual({
                statusCode: 500,
                body: expect.stringContaining('Error'),
                headers: { 'Content-Type': 'application/json' },
            })

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
                request: expect.any(Object),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `[http] ${handler.http.path} sent 500`, {
                response: {
                    statusCode: 500,
                },
            })
            expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
        })
    },
)

it.each([new Error(), EventError.internalServerError(), 'foobar'])(
    '%s - promise throws with Error, gives failure',
    async (error) => {
        const h = vi.fn()
        const handler = httpApiHandler({
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: h,
            },
        })
        await asyncForAll(tuple(httpApiEvent(handler), await context({})), async ([req, ctx]) => {
            ctx.mockClear()

            h.mockImplementation(() => {
                throw error
            })

            const response = await handleHTTPEvent(handler, req.raw, ctx)

            expect(response).toEqual({
                statusCode: 500,
                body: expect.stringContaining('Error'),
                headers: { 'Content-Type': 'application/json' },
            })

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
                request: expect.any(Object),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `[http] ${handler.http.path} sent 500`, {
                response: {
                    statusCode: 500,
                },
            })
            expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
        })
    },
)

it.each([new Error(), EventError.internalServerError(), 'foobar'])(
    '%s - promise throws with Error, , custom error serializer',
    async (error) => {
        const h = vi.fn()
        const seralizer = vi.fn()
        const handler = httpApiHandler({
            http: {
                method,
                path,
                schema: { responses: {} },
                handler: h,
            },
            serialize: {
                error: seralizer,
            },
        })
        await asyncForAll(
            tuple(httpApiEvent(handler), await context({}), object({ body: json(), headers: json(), statusCode: integer() })),
            async ([req, ctx, ret]) => {
                ctx.mockClear()

                seralizer.mockClear()
                seralizer.mockReturnValue(ret)

                h.mockImplementation(() => {
                    throw error
                })

                const response = await handleHTTPEvent(handler, req.raw, ctx)

                expect(response).toEqual({
                    headers: expect.anything(),
                    body: JSON.stringify(ret.body),
                    statusCode: ret.statusCode,
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(1, `[http] ${handler.http.path} start`, {
                    request: expect.any(Object),
                })
                expect(ctx.logger.info).toHaveBeenNthCalledWith(
                    2,
                    `[http] ${handler.http.path} sent ${ret.statusCode.toString()}`,
                    {
                        response: {
                            statusCode: ret.statusCode,
                        },
                    },
                )
                expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
            },
        )
    },
)
