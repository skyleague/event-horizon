import { handleHTTPEvent } from './handler.js'
import { httpHandler } from './http.js'

import { EventError } from '../../errors/index.js'

import { alpha, asyncForAll, constant, integer, isString, json, object, oneOf, random, tuple } from '@skyleague/axioms'
import { httpEvent } from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import { type Schema } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'

const neverTrue = {
    is: () => false,
    schema: { type: 'object' },
    errors: [],
} as unknown as Schema<string>

const method = random(oneOf(constant('get'), constant('put')))
const path = `/${random(alpha())}` as const

it('plaintext success does not give failures', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { responses: {} },
            bodyType: 'plaintext' as const,
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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

it('json success does not give failures', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { responses: {} },
            bodyType: 'json' as const,
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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

it('binary success does not give failures', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { responses: {} },
            bodyType: 'binary' as const,
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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

it('body schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { body: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Client error found`, expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it('query schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { query: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Client error found`, expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it('path schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { path: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Client error found`, expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it('headers schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { headers: neverTrue, responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), json(), await context({})), async ([req, ret, ctx]) => {
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
        expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `Client error found`, expect.any(EventError))
        expect(ctx.logger.info).toHaveBeenNthCalledWith(3, `[http] ${handler.http.path} sent 400`, {
            response: { statusCode: 400 },
        })
        expect(ctx.logger.error).not.toHaveBeenCalled()
    })
})

it.each([new Error(), EventError.internalServerError(), 'foobar'])('promise reject with Error, gives failure', async (error) => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), await context({})), async ([req, ctx]) => {
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
        expect(ctx.logger.error).toHaveBeenCalledWith(`Error found`, expect.any(EventError))
    })
})

it.each([new Error(), EventError.internalServerError(), 'foobar'])('promise throws with Error, gives failure', async (error) => {
    const h = vi.fn()
    const handler = httpHandler({
        http: {
            method,
            path,
            schema: { responses: {} },
            handler: h,
        },
    })
    await asyncForAll(tuple(httpEvent(handler), await context({})), async ([req, ctx]) => {
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
        expect(ctx.logger.error).toHaveBeenCalledWith(`Error found`, expect.any(EventError))
    })
})

it.each([new Error(), EventError.internalServerError(), 'foobar'])(
    'promise throws with Error, custom error serializer',
    async (error) => {
        const h = vi.fn()
        const seralizer = vi.fn()
        const handler = httpHandler({
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
            tuple(httpEvent(handler), await context({}), object({ body: json(), headers: json(), statusCode: integer() })),
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
                expect(ctx.logger.info).toHaveBeenNthCalledWith(2, `[http] ${handler.http.path} sent ${ret.statusCode}`, {
                    response: {
                        statusCode: ret.statusCode,
                    },
                })
                expect(ctx.logger.error).toHaveBeenCalledWith(`Error found`, expect.any(EventError))
            }
        )
    }
)
