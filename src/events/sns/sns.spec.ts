import { snsHandler } from './sns.js'
import type { SNSEvent } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEvent } from '../../test/aws/apigateway/apigateway.type.js'
import { EventBridgeEvent } from '../../test/aws/eventbridge/eventbridge.type.js'
import { FirehoseTransformationEvent } from '../../test/aws/firehose/firehose.type.js'
import { KinesisStreamEvent } from '../../test/aws/kinesis/kinesis.type.js'
import { S3Event } from '../../test/aws/s3/s3.type.js'
import { S3BatchEvent } from '../../test/aws/s3-batch/s3.type.js'
import { SecretRotationEvent } from '../../test/aws/secret-rotation/secret-rotation.type.js'
import { SNSEvent as SNSEventSchema } from '../../test/aws/sns/sns.type.js'
import { SQSEvent } from '../../test/aws/sqs/sqs.type.js'
import { context } from '../../test/test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi, expectTypeOf } from 'vitest'

it('handles sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { kernel: sns }
    )
    await asyncForAll(tuple(arbitrary(SNSEventSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
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
        { kernel: sns }
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
                // arbitrary(SNSEvent)
                arbitrary(SQSEvent)
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            sns.mockClear()
            sns.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: sns, schema: {} },
        },
        { kernel: sns }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(sns).not.toHaveBeenCalled()
})
