import { rawHandler } from './raw.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEvent } from '../../test/aws/apigateway/apigateway.type.js'
import { EventBridgeEvent } from '../../test/aws/eventbridge/eventbridge.type.js'
import { FirehoseTransformationEvent } from '../../test/aws/firehose/firehose.type.js'
import { KinesisStreamEvent } from '../../test/aws/kinesis/kinesis.type.js'
import { S3Event } from '../../test/aws/s3/s3.type.js'
import { S3BatchEvent } from '../../test/aws/s3-batch/s3.type.js'
import { SecretRotationEvent } from '../../test/aws/secret-rotation/secret-rotation.type.js'
import { SNSEvent } from '../../test/aws/sns/sns.type.js'
import { SQSEvent } from '../../test/aws/sqs/sqs.type.js'
import { context } from '../../test/test/context/context.js'

import { asyncForAll, json, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi, expectTypeOf } from 'vitest'

it('handles schema types', () => {
    const handler = rawHandler({
        raw: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<'payload'>()

                return 'result'
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
        { kernel: raw }
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisStreamEvent),
                arbitrary(S3Event),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent),
                json(),
                unknown()
            ),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            raw.mockClear()
            raw.mockReturnValue(ret)
            const response = await handler._options.handler(event as any, ctx)
            expect(response).toBe(ret)
            expect(raw).toHaveBeenCalledWith(expect.anything(), event, ctx)
        }
    )
})

it('warmup should early exit', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: raw, schema: {} },
        },
        { kernel: raw }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(raw).not.toHaveBeenCalled()
})
