import { httpApiHandler } from './http.js'
import type { HTTPRequest } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'

import { alpha, asyncForAll, constant, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import {
    APIGatewayProxyEvent,
    EventBridgeEvent,
    FirehoseTransformationEvent,
    KinesisStreamEvent,
    S3BatchEvent,
    S3Event,
    SNSEvent,
    SQSEvent,
    SecretRotationEvent,
} from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi, expectTypeOf } from 'vitest'

const method = random(oneOf(constant('get'), constant('put')))
const path = `/${random(alpha())}` as const

it('handles http events', async () => {
    const http = vi.fn()
    const handler = httpApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: vi.fn(),
            },
        },
        { kernel: http }
    )
    await asyncForAll(tuple(arbitrary(APIGatewayProxyEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        http.mockClear()
        http.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(http).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('handles schema types', () => {
    const handler = httpApiHandler({
        http: {
            method,
            path,
            schema: {
                body: literalSchema<'body'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
                responses: { 200: literalSchema<'200-response'>() },
            },
            bodyType: 'plaintext' as const,
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<HTTPRequest<'body', 'path', 'query', 'headers'>>()

                return {
                    statusCode: 200,
                    body: '200-response',
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (request: HTTPRequest<'body', 'path', 'query', 'headers'>) => {
            statusCode: number
            body: '200-response'
        }
    >()
})

it('handles schema types and gives errors', () => {
    httpApiHandler({
        http: {
            method,
            path,
            schema: {
                responses: { 200: literalSchema<'200-response'>() },
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    statusCode: 200,
                    body: 'not-200-response',
                }
            },
        },
    })
})

it('does not handle non http events', async () => {
    const http = vi.fn()
    const handler = httpApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: vi.fn(),
            },
        },
        { kernel: http }
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                // arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisStreamEvent),
                arbitrary(S3Event),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent)
            ),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            http.mockClear()
            http.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const http = vi.fn()
    const handler = httpApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: http,
            },
        },
        { kernel: http }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(http).not.toHaveBeenCalled()
})
