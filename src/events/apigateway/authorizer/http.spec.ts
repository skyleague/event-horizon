import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { literalSchema, warmerEvent } from '../../../../test/schema.js'
import { APIGatewayProxyEventV2Schema } from '../../../aws/apigateway/http.schema.js'
import { APIGatewayRequestAuthorizerEventV2Schema } from '../../../aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema } from '../../../aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../../aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../../aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../../aws/firehose/firehose.type.js'
import { KinesisDataStreamSchema } from '../../../aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../../aws/s3-batch/s3.type.js'
import { S3Schema } from '../../../aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../../aws/secret-rotation/secret-rotation.type.js'
import { SnsSchema } from '../../../aws/sns/sns.type.js'
import { SqsSchema } from '../../../aws/sqs/sqs.type.js'
import { context } from '../../../test/context/context.js'
import { httpApiAuthorizer } from './http.js'
import type { RequestAuthorizerEvent } from './types.js'

it('handles authorizer events', async () => {
    const http = vi.fn()
    const handler = httpApiAuthorizer(
        {
            request: {
                schema: {},
                handler: vi.fn() as any,
            },
        },
        { _kernel: http },
    )

    await asyncForAll(
        tuple(arbitrary(APIGatewayRequestAuthorizerEventV2Schema), unknown(), await context(handler)),
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
    const handler = httpApiAuthorizer({
        request: {
            schema: {
                context: literalSchema<'context'>(),
                path: literalSchema<'path'>(),
                query: literalSchema<'query'>(),
                headers: literalSchema<'headers'>(),
            },
            security: {
                foo: {
                    type: 'apiKey',
                    name: 'api_key',
                    in: 'header',
                },
            },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<
                    RequestAuthorizerEvent<
                        'path',
                        'query',
                        'headers',
                        {
                            readonly foo: {
                                readonly type: 'apiKey'
                                readonly name: 'api_key'
                                readonly in: 'header'
                            }
                        },
                        'http'
                    >
                >()

                return {
                    isAuthorized: true,
                    context: 'context' as const,
                }
            },
        },
    })
    expectTypeOf(handler.request.handler).toEqualTypeOf<
        (
            request: RequestAuthorizerEvent<
                'path',
                'query',
                'headers',
                {
                    readonly foo: {
                        readonly type: 'apiKey'
                        readonly name: 'api_key'
                        readonly in: 'header'
                    }
                },
                'http'
            >,
        ) => {
            isAuthorized: true
            context: 'context'
        }
    >()
})

it('handles schema types and gives errors', () => {
    httpApiAuthorizer({
        request: {
            schema: {
                context: literalSchema<'context'>(),
            },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return {
                    isAuthorized: true,
                    context: 'not-context' as const,
                }
            },
        },
    })
})

it('does not handle non authorizer events', async () => {
    const http = vi.fn()
    const handler = httpApiAuthorizer(
        {
            request: {
                handler: vi.fn() as any,
            },
        },
        { _kernel: http },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                // arbitrary(APIGatewayRequestAuthorizerEventSchema),
                // arbitrary(APIGatewayRequestAuthorizerEventV2Schema),
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
    const handler = httpApiAuthorizer(
        {
            request: {
                schema: { responses: {} },
                handler: http,
            },
        },
        { _kernel: http },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(http).not.toHaveBeenCalled()
})
