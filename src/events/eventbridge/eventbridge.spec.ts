import { eventBridgeHandler } from './eventbridge.js'

import { warmerEvent } from '../../../test/schema.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import {
    APIGatewayProxyEvent,
    EventBridgeEvent,
    FirehoseTransformationEvent,
    KinesisStreamEvent,
    S3BatchEvent,
    S3Event,
    SNSEvent,
    SQSEvent,
    SecretRotationEvent,
} from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'

it('handles eventbridge events', async () => {
    const eventBridge = vi.fn()
    const handler = eventBridgeHandler(
        {
            eventBridge: { handler: eventBridge, schema: {} },
        },
        { kernel: eventBridge }
    )
    await asyncForAll(tuple(arbitrary(EventBridgeEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        eventBridge.mockClear()
        eventBridge.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(eventBridge).toHaveBeenCalledWith(expect.anything(), event, ctx)
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
