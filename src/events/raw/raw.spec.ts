import { asyncForAll, json, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEventV2Schema } from '../../aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema } from '../../aws/apigateway/rest.type.js'
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
import { rawHandler } from './raw.js'

it('handles schema types', () => {
    const handler = rawHandler({
        raw: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<'payload'>()

                return 'result' as const
            },
        },
    })
    expectTypeOf(handler.raw.handler).toEqualTypeOf<(request: 'payload') => 'result'>()
})

it('handles schema types and gives errors', () => {
    rawHandler({
        raw: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return 'not-result' as const
            },
        },
    })
})

it('does handle raw events', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: vi.fn(), schema: {} },
        },
        { _kernel: raw },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                arbitrary(DynamoDBStreamSchema),
                json(),
                unknown(),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            raw.mockClear()
            raw.mockReturnValue(ret)
            const response = await handler._options.handler(event as any, ctx)
            expect(response).toBe(ret)
            expect(raw).toHaveBeenCalledWith(expect.anything(), event, ctx)
        },
    )
})

it('warmup should early exit', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: raw, schema: {} },
        },
        { _kernel: raw },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(raw).not.toHaveBeenCalled()
})
