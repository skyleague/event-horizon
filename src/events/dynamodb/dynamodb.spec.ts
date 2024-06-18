import { dynamodbHandler } from './dynamodb.js'

import { warmerEvent } from '../../../test/schema.js'
import { KinesisDataStreamSchema } from '../../dev/aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../dev/aws/s3-batch/s3.type.js'
import { S3Schema } from '../../dev/aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../dev/aws/secret-rotation/secret-rotation.type.js'
import { context } from '../../test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import { APIGatewayProxyEventV2Schema } from '../../dev/aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema } from '../../dev/aws/apigateway/rest.type.js'
import { DynamoDBStreamSchema } from '../../dev/aws/dynamodb/dynamodb.type.js'
import { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../dev/aws/firehose/firehose.type.js'
import { SnsSchema } from '../../dev/aws/sns/sns.type.js'
import { SqsSchema } from '../../dev/aws/sqs/sqs.type.js'

it('handles dynamodb events', async () => {
    const dynamodb = vi.fn()
    const handler = dynamodbHandler(
        {
            dynamodb: { handler: vi.fn() },
        },
        { _kernel: dynamodb },
    )
    await asyncForAll(tuple(arbitrary(DynamoDBStreamSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        dynamodb.mockClear()
        dynamodb.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(dynamodb).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('does not handle non dynamodb events', async () => {
    const dynamodb = vi.fn()
    const handler = dynamodbHandler(
        {
            dynamodb: { handler: vi.fn() },
        },
        { _kernel: dynamodb },
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
                // arbitrary(DynamoDBStreamSchema),
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            dynamodb.mockClear()
            dynamodb.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const dynamodb = vi.fn()
    const handler = dynamodbHandler(
        {
            dynamodb: { handler: dynamodb },
        },
        { _kernel: dynamodb },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(dynamodb).not.toHaveBeenCalled()
})
