import { asyncForAll, boolean, json, tuple } from '@skyleague/axioms'
import type { Schema } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import { restApiAuthorizerEvent } from '../../../dev/event-horizon/apigateway/authorizer/rest.js'
import { EventError } from '../../../errors/event-error/event-error.js'
import { context } from '../../../test/context/context.js'
import { handleAuthorizerEvent } from './handler.js'
import { restApiAuthorizer } from './http.js'

const neverTrue = {
    is: () => false,
    schema: { type: 'object' },
    errors: [],
    // biome-ignore lint/complexity/noBannedTypes: this is a test
} as unknown as Schema<{}>

it('success handles authoriziation correctly', async () => {
    const h = vi.fn()
    const handler = restApiAuthorizer({
        request: {
            schema: {},
            handler: h,
        },
    })
    await asyncForAll(
        tuple(restApiAuthorizerEvent(handler), await context({}), boolean(), json()),
        async ([req, ctx, isAuthorized, context]) => {
            ctx.mockClear()

            h.mockReturnValue({ isAuthorized, context })
            const response = await handleAuthorizerEvent(handler, req.raw, ctx)

            expect(response).toEqual({
                // isAuthorized,
                policyDocument: {
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: isAuthorized ? 'Allow' : 'Deny',
                            Resource: req.raw.methodArn,
                        },
                    ],
                    Version: '2012-10-17',
                },
                principalId: req.raw.requestContext.identity.sourceIp ?? 'unknown',
                context,
            })

            expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: req.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                request: expect.any(Object),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[authorizer] sent', {
                response: { isAuthorized, context },
            })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('success handles authoriziation correctly', async () => {
    const h = vi.fn()
    const handler = restApiAuthorizer({
        request: {
            schema: {},
            handler: h,
        },
    })
    await asyncForAll(
        tuple(restApiAuthorizerEvent(handler), await context({}), boolean(), json()),
        async ([req, ctx, isAuthorized, context]) => {
            ctx.mockClear()

            h.mockReturnValue({ isAuthorized, context })
            const response = await handleAuthorizerEvent(handler, req.raw, ctx)

            expect(response).toEqual({
                // isAuthorized,
                policyDocument: {
                    Statement: [
                        {
                            Action: 'execute-api:Invoke',
                            Effect: isAuthorized ? 'Allow' : 'Deny',
                            Resource: req.raw.methodArn,
                        },
                    ],
                    Version: '2012-10-17',
                },
                principalId: req.raw.requestContext.identity.sourceIp ?? 'unknown',
                context,
            })

            expect(h).toHaveBeenCalledWith(expect.objectContaining({ raw: req.raw }), ctx)

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                request: expect.any(Object),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[authorizer] sent', {
                response: { isAuthorized, context },
            })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('query schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = restApiAuthorizer({
        request: {
            schema: { query: neverTrue },
            handler: h,
        },
    })
    await asyncForAll(
        tuple(restApiAuthorizerEvent(handler), await context({}), boolean(), json()),
        async ([req, ctx, isAuthorized, context]) => {
            ctx.mockClear()

            h.mockReturnValue({ isAuthorized, context })
            await expect(() => handleAuthorizerEvent(handler, req.raw, ctx)).rejects.toThrowError('Unauthorized')

            expect(h).not.toHaveBeenCalled()

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                error: expect.any(EventError),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[authorizer] sent', {
                error: new Error('Unauthorized'),
            })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('path schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = restApiAuthorizer({
        request: {
            schema: { path: neverTrue },
            handler: h,
        },
    })
    await asyncForAll(
        tuple(restApiAuthorizerEvent(handler), await context({}), boolean(), json()),
        async ([req, ctx, isAuthorized, context]) => {
            ctx.mockClear()

            h.mockReturnValue({ isAuthorized, context })
            await expect(() => handleAuthorizerEvent(handler, req.raw, ctx)).rejects.toThrowError('Unauthorized')

            expect(h).not.toHaveBeenCalled()

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                error: expect.any(EventError),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[authorizer] sent', {
                error: new Error('Unauthorized'),
            })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it('headers schema validation, gives failure', async () => {
    const h = vi.fn()
    const handler = restApiAuthorizer({
        request: {
            schema: { headers: neverTrue },
            handler: h,
        },
    })
    await asyncForAll(
        tuple(restApiAuthorizerEvent(handler), await context({}), boolean(), json()),
        async ([req, ctx, isAuthorized, context]) => {
            ctx.mockClear()

            h.mockReturnValue({ isAuthorized, context })
            await expect(() => handleAuthorizerEvent(handler, req.raw, ctx)).rejects.toThrowError('Unauthorized')

            expect(h).not.toHaveBeenCalled()

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                error: expect.any(EventError),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, 'Client error found', expect.any(EventError))
            expect(ctx.logger.info).toHaveBeenNthCalledWith(3, '[authorizer] sent', {
                error: new Error('Unauthorized'),
            })
            expect(ctx.logger.error).not.toHaveBeenCalled()
        },
    )
})

it.each([new Error(), EventError.internalServerError(), 'foobar'])(
    '%s - promise reject with Error, gives failure',
    async (error) => {
        const h = vi.fn()
        const handler = restApiAuthorizer({
            request: {
                schema: {},
                handler: h,
            },
        })
        await asyncForAll(tuple(restApiAuthorizerEvent(handler), await context({})), async ([req, ctx]) => {
            ctx.mockClear()

            h.mockRejectedValue(error)
            await expect(() => handleAuthorizerEvent(handler, req.raw, ctx)).rejects.toThrowError('Unauthorized')

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                request: expect.any(Object),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[authorizer] sent', {
                error: new Error('Unauthorized'),
            })
            expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
        })
    },
)

it.each([new Error(), EventError.internalServerError(), 'foobar'])(
    '%s -promise throws with Error, gives failure',
    async (error) => {
        const h = vi.fn()
        const handler = restApiAuthorizer({
            request: {
                schema: {},
                handler: h,
            },
        })
        await asyncForAll(tuple(restApiAuthorizerEvent(handler), await context({})), async ([req, ctx]) => {
            ctx.mockClear()

            h.mockImplementation(() => {
                throw error
            })
            await expect(() => handleAuthorizerEvent(handler, req.raw, ctx)).rejects.toThrowError('Unauthorized')

            expect(ctx.logger.info).toHaveBeenNthCalledWith(1, '[authorizer] start', {
                request: expect.any(Object),
            })
            expect(ctx.logger.info).toHaveBeenNthCalledWith(2, '[authorizer] sent', {
                error: new Error('Unauthorized'),
            })
            expect(ctx.logger.error).toHaveBeenCalledWith('Error found', expect.any(EventError))
        })
    },
)
