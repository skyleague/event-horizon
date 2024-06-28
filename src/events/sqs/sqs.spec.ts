import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import type { SQSBatchItemFailure } from 'aws-lambda'
import { describe, expect, expectTypeOf, it, vi } from 'vitest'
import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEventV2Schema } from '../../dev/aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema } from '../../dev/aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../dev/aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../dev/aws/firehose/firehose.type.js'
import { KinesisDataStreamSchema } from '../../dev/aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../dev/aws/s3-batch/s3.type.js'
import { S3Schema } from '../../dev/aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../dev/aws/secret-rotation/secret-rotation.type.js'
import { SnsSchema } from '../../dev/aws/sns/sns.type.js'
import { SqsSchema } from '../../dev/aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'
import { sqsGroupHandler, sqsHandler } from './sqs.js'
import type { SQSEvent, SQSMessageGroup } from './types.js'

describe('sqsHandler', () => {
    it('handles sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
        )
        await asyncForAll(tuple(arbitrary(SqsSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
            sqs.mockClear()
            sqs.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
        })
    })

    it('handles schema types', () => {
        const handler = sqsHandler({
            sqs: {
                schema: { payload: literalSchema<'payload'>() },
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSEvent<'payload'>>()
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSEvent<'payload'>) => void>()
    })

    it('does not handle non sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
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
                    // arbitrary(SQSEvent),
                    arbitrary(DynamoDBStreamSchema),
                ).filter((e) => !('Records' in e) || e.Records.length > 0),
                unknown(),
                await context(handler),
            ),
            async ([event, ret, ctx]) => {
                sqs.mockClear()
                sqs.mockReturnValue(ret)
                await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                    /Lambda was invoked with an unexpected event type/,
                )
            },
        )
    })

    it('warmup should early exit', async () => {
        const sqs = vi.fn()
        const handler = sqsHandler(
            {
                sqs: { handler: sqs, schema: {} },
            },
            { _kernel: sqs },
        )

        await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
        expect(sqs).not.toHaveBeenCalled()
    })
})

describe('sqsGroupHandler', () => {
    it('handles sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsGroupHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
        )
        await asyncForAll(tuple(arbitrary(SqsSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
            sqs.mockClear()
            sqs.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
        })
    })

    it('handles schema types', () => {
        const handler = sqsGroupHandler({
            sqs: {
                schema: { payload: literalSchema<'payload'>() },
                handler: (request) => {
                    expectTypeOf(request).toEqualTypeOf<SQSMessageGroup<'payload'>>()
                    return [{ itemIdentifier: 'sdf' }]
                },
            },
        })
        expectTypeOf(handler.sqs.handler).toEqualTypeOf<(request: SQSMessageGroup<'payload'>) => SQSBatchItemFailure[]>()
    })

    it('does not handle non sqs events', async () => {
        const sqs = vi.fn()
        const handler = sqsGroupHandler(
            {
                sqs: { handler: vi.fn(), schema: {} },
            },
            { _kernel: sqs },
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
                    // arbitrary(SQSEvent),
                    arbitrary(DynamoDBStreamSchema),
                ).filter((e) => !('Records' in e) || e.Records.length > 0),
                unknown(),
                await context(handler),
            ),
            async ([event, ret, ctx]) => {
                sqs.mockClear()
                sqs.mockReturnValue(ret)
                await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                    /Lambda was invoked with an unexpected event type/,
                )
            },
        )
    })

    it('warmup should early exit', async () => {
        const sqs = vi.fn()
        const handler = sqsGroupHandler(
            {
                sqs: { handler: sqs, schema: {} },
            },
            { _kernel: sqs },
        )

        await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
        expect(sqs).not.toHaveBeenCalled()
    })
})
