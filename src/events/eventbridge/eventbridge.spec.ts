import { eventBridgeHandler } from './eventbridge.js'
import type { EventBridgeEvent } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { APIGatewayProxyEvent } from '../../test/aws/apigateway/apigateway.type.js'
import { EventBridgeEvent as EventBridgeEventSchema } from '../../test/aws/eventbridge/eventbridge.type.js'
import { FirehoseTransformationEvent } from '../../test/aws/firehose/firehose.type.js'
import { KinesisStreamEvent } from '../../test/aws/kinesis/kinesis.type.js'
import { S3Event } from '../../test/aws/s3/s3.type.js'
import { S3BatchEvent } from '../../test/aws/s3-batch/s3.type.js'
import { SecretRotationEvent } from '../../test/aws/secret-rotation/secret-rotation.type.js'
import { SNSEvent } from '../../test/aws/sns/sns.type.js'
import { SQSEvent } from '../../test/aws/sqs/sqs.type.js'
import { context } from '../../test/test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, expectTypeOf, vi } from 'vitest'

it('handles eventbridge events', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { kernel: eventBridge }
    )
    await asyncForAll(tuple(arbitrary(EventBridgeEventSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        eventBridge.mockClear()
        eventBridge.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(eventBridge).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('handles schema types', () => {
    const handler = eventBridgeHandler({
        eventBridge: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<EventBridgeEvent<'payload'>>()

                return 'result'
            },
        },
    })
    expectTypeOf(handler.eventBridge.handler).toEqualTypeOf<(request: EventBridgeEvent<'payload'>) => 'result'>()
})

it('handles schema types and gives errors', () => {
    eventBridgeHandler({
        eventBridge: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return 'not-result'
            },
        },
    })
})

it('does not handle non eventbridge events', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { kernel: eventBridge }
    )
    await asyncForAll(
        tuple(
            oneOf(
                // arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisStreamEvent),
                arbitrary(S3Event),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent)
            ),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            eventBridge.mockClear()
            eventBridge.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { kernel: eventBridge }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(eventBridge).not.toHaveBeenCalled()
})
