import { snsHandler } from './sns.js'
import type { SNSEvent } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { KinesisDataStreamSchema } from '../../aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../aws/s3-batch/s3.type.js'
import { S3Schema } from '../../aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../aws/secret-rotation/secret-rotation.type.js'
import { context } from '../../test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { APIGatewayProxyEventV2Schema, APIGatewayRequestAuthorizerEventV2Schema } from '../../aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema, APIGatewayRequestAuthorizerEventSchema } from '../../aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../aws/firehose/firehose.type.js'
import { SnsSchema } from '../../aws/sns/sns.type.js'
import { SqsSchema } from '../../aws/sqs/sqs.type.js'

it('handles sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { _kernel: sns },
    )
    await asyncForAll(tuple(arbitrary(SnsSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        sns.mockClear()
        sns.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(sns).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('handles schema types', () => {
    const handler = snsHandler({
        sns: {
            schema: { payload: literalSchema<'payload'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<SNSEvent<'payload'>>()
            },
        },
    })
    expectTypeOf(handler.sns.handler).toEqualTypeOf<(request: SNSEvent<'payload'>) => void>()
})

it('does not handle non sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { _kernel: sns },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(APIGatewayRequestAuthorizerEventSchema),
                arbitrary(APIGatewayRequestAuthorizerEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                // arbitrary(SnsSchema)
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            sns.mockClear()
            sns.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: sns, schema: {} },
        },
        { _kernel: sns },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(sns).not.toHaveBeenCalled()
})
