import { kinesisHandler } from './kinesis.js'
import type { KinesisEvent } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEvent } from '../../dev/aws/apigateway/apigateway.type.js'
import { EventBridgeEvent } from '../../dev/aws/eventbridge/eventbridge.type.js'
import { FirehoseTransformationEvent } from '../../dev/aws/firehose/firehose.type.js'
import { KinesisStreamEvent } from '../../dev/aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../dev/aws/s3-batch/s3.type.js'
import { S3Event } from '../../dev/aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../dev/aws/secret-rotation/secret-rotation.type.js'
import { SNSEvent } from '../../dev/aws/sns/sns.type.js'
import { SQSEvent } from '../../dev/aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'

it('handles kinesis events', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: vi.fn(), schema: {} },
        },
        { kernel: kinesis },
    )
    await asyncForAll(tuple(arbitrary(KinesisStreamEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        kinesis.mockClear()
        kinesis.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(kinesis).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('handles schema types', () => {
    const handler = kinesisHandler({
        kinesis: {
            schema: { payload: literalSchema<'payload'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<KinesisEvent<'payload'>>()
            },
        },
    })
    expectTypeOf(handler.kinesis.handler).toEqualTypeOf<(request: KinesisEvent<'payload'>) => void>()
})

it('does not handle non kinesis events', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: vi.fn(), schema: {} },
        },
        { kernel: kinesis },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEvent),
                // arbitrary(KinesisStreamEvent),
                arbitrary(S3Event),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            kinesis.mockClear()
            kinesis.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: kinesis, schema: {} },
        },
        { kernel: kinesis },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(kinesis).not.toHaveBeenCalled()
})
