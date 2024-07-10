import { constants, alpha, asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEventV2Schema } from '../../aws/apigateway/http.type.js'
import { DynamoDBStreamSchema } from '../../aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../aws/firehose/firehose.type.js'
import { KinesisDataStreamSchema } from '../../aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../aws/s3-batch/s3.type.js'
import { S3Schema } from '../../aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../aws/secret-rotation/secret-rotation.type.js'
import { SnsSchema } from '../../aws/sns/sns.type.js'
import { SqsSchema } from '../../aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'
import { restApiHandler } from './http.js'
import type { HTTPRequest } from './types.js'

const method = random(constants('get', 'put'))
const path = `/${random(alpha())}` as const

it('handles http events', async () => {
    const http = vi.fn()
    const handler = restApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: vi.fn(),
            },
        },
        { _kernel: http },
    )

    await asyncForAll(
        tuple(arbitrary(APIGatewayProxyEventV2Schema), unknown(), await context(handler)),
        async ([event, ret, ctx]) => {
            http.mockClear()
            http.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(http).toHaveBeenCalledWith(expect.anything(), event, ctx)
        },
    )
})

it('handles schema types', () => {
    const handler = restApiHandler({
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
                expectTypeOf(request).toEqualTypeOf<HTTPRequest<'body', 'path', 'query', 'headers', 'rest'>>()

                return {
                    statusCode: 200,
                    body: '200-response' as const,
                }
            },
        },
    })
    expectTypeOf(handler.http.handler).toEqualTypeOf<
        (request: HTTPRequest<'body', 'path', 'query', 'headers', 'rest'>) => {
            statusCode: number
            body: '200-response'
        }
    >()
})

it('handles schema types and gives errors', () => {
    restApiHandler({
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
    const handler = restApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: vi.fn(),
            },
        },
        { _kernel: http },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                arbitrary(KinesisFirehoseSchema),
                // arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            http.mockClear()
            http.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const http = vi.fn()
    const handler = restApiHandler(
        {
            http: {
                method,
                path,
                schema: { responses: {} },
                bodyType: 'plaintext' as const,
                handler: http,
            },
        },
        { _kernel: http },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(http).not.toHaveBeenCalled()
})
