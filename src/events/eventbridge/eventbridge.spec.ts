import { eventBridgeHandler } from './eventbridge.js'
import type { EventBridgeEvent } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'
import { KinesisDataStreamSchema } from '../../dev/aws/kinesis/kinesis.type.js'
import { S3BatchEvent } from '../../dev/aws/s3-batch/s3.type.js'
import { S3Schema } from '../../dev/aws/s3/s3.type.js'
import { SecretRotationEvent } from '../../dev/aws/secret-rotation/secret-rotation.type.js'
import { context } from '../../test/context/context.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { APIGatewayProxyEventV2Schema } from '../../dev/aws/apigateway/http.type.js'
import { APIGatewayProxyEventSchema } from '../../dev/aws/apigateway/rest.type.js'
import { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'
import { KinesisFirehoseSchema } from '../../dev/aws/firehose/firehose.type.js'
import { SnsSchema } from '../../dev/aws/sns/sns.type.js'
import { SqsSchema } from '../../dev/aws/sqs/sqs.type.js'

it('handles eventbridge events', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { _kernel: eventBridge },
    )
    await asyncForAll(tuple(arbitrary(EventBridgeSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
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

                return 'result' as const
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
                return 'not-result' as const
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
        { _kernel: eventBridge },
    )
    await asyncForAll(
        tuple(
            oneOf(
                // arbitrary(EventBridgeEvent),
                arbitrary(KinesisFirehoseSchema),
                arbitrary(APIGatewayProxyEventSchema),
                arbitrary(APIGatewayProxyEventV2Schema),
                arbitrary(KinesisDataStreamSchema),
                arbitrary(S3Schema),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SnsSchema),
                arbitrary(SqsSchema),
            ),
            unknown(),
            await context(handler),
        ),
        async ([event, ret, ctx]) => {
            eventBridge.mockClear()
            eventBridge.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/,
            )
        },
    )
})

it('warmup should early exit', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { _kernel: eventBridge },
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(eventBridge).not.toHaveBeenCalled()
})
