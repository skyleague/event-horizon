import { s3BatchHandler } from './s3-batch.js'
import type { S3BatchTask } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEvent } from '../../test/aws/apigateway/apigateway.type.js'
import { EventBridgeEvent } from '../../test/aws/eventbridge/eventbridge.type.js'
import { FirehoseTransformationEvent } from '../../test/aws/firehose/firehose.type.js'
import { KinesisStreamEvent } from '../../test/aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../test/aws/s3-batch/s3.type.js'
import { S3Event } from '../../test/aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../test/aws/secret-rotation/secret-rotation.type.js'
import { SNSEvent } from '../../test/aws/sns/sns.type.js'
import { SQSEvent } from '../../test/aws/sqs/sqs.type.js'
import { context } from '../../test/test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'

it('handles s3Batch events', async () => {
    const s3Batch = vi.fn()
    const handler = s3BatchHandler(
        {
            s3Batch: { handler: vi.fn(), schema: {} },
        },
        { kernel: s3Batch },
    )
    await asyncForAll(tuple(arbitrary(S3BatchEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        s3Batch.mockClear()
        s3Batch.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(s3Batch).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('handles schema types', () => {
    const handler = s3BatchHandler({
        s3Batch: {
            schema: { result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<S3BatchTask>()
                return { status: 'Succeeded', payload: 'result' }
            },
        },
    })
    expectTypeOf(handler.s3Batch.handler).toEqualTypeOf<
        (request: S3BatchTask) => {
            status: 'Succeeded'
            payload: 'result'
        }
    >()
})

it('handles schema types and gives errors', () => {
    s3BatchHandler({
        s3Batch: {
            schema: { result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return { status: 'Succeeded', payload: 'not-result' as const }
            },
        },
    })
})

it('does not handle non s3Batch events', async () => {
    const s3Batch = vi.fn()
    const handler = s3BatchHandler(
        {
            s3Batch: { handler: vi.fn(), schema: {} },
        },
        { kernel: s3Batch },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisStreamEvent),
                arbitrary(S3Event),
                // arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            s3Batch.mockClear()
            s3Batch.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const s3Batch = vi.fn()
    const handler = s3BatchHandler(
        {
            s3Batch: { handler: s3Batch, schema: {} },
        },
        { kernel: s3Batch },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(s3Batch).not.toHaveBeenCalled()
})
