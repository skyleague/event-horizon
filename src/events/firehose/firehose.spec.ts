import { array, asyncForAll, json, object, oneOf, random, record, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEventV2Schema } from '../../dev/aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema } from '../../dev/aws/apigateway/rest.type.js'
import { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../dev/aws/firehose/firehose.type.js'
import { KinesisDataStreamSchema } from '../../dev/aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../dev/aws/s3-batch/s3.type.js'
import { S3Schema } from '../../dev/aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../dev/aws/secret-rotation/secret-rotation.type.js'
import { SnsSchema } from '../../dev/aws/sns/sns.type.js'
import { SqsSchema } from '../../dev/aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'
import { firehoseHandler } from './firehose.js'
import type { FirehoseTransformationEvent } from './types.js'

it('handles firehose events', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: vi.fn(), schema: {} },
        },
        { _kernel: firehose },
    )
    await asyncForAll(tuple(arbitrary(KinesisFirehoseSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        firehose.mockClear()
        firehose.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(firehose).toHaveBeenCalledWith(expect.anything(), event.records, ctx)
    })
})

it('handles schema types', () => {
    const handler = firehoseHandler({
        firehose: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<FirehoseTransformationEvent<'payload'>>()

                return { status: 'Ok', payload: 'result' } as const
            },
        },
    })
    expectTypeOf(handler.firehose.handler).toEqualTypeOf<
        (request: NoInfer<FirehoseTransformationEvent<'payload'>>) => {
            readonly status: 'Ok'
            readonly payload: 'result'
        }
    >()
})

it('handles schema types and gives errors', () => {
    firehoseHandler({
        firehose: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return { status: 'Ok', payload: 'not-result' } as const
            },
        },
    })
})

it('does not handle non firehose events', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: vi.fn(), schema: {} },
        },
        { _kernel: firehose },
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeSchema),
                // arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
                object({ records: array(record(json()), { minLength: 1 }) }),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            firehose.mockClear()
            firehose.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: firehose, schema: {} },
        },
        { _kernel: firehose },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(firehose).not.toHaveBeenCalled()
})
