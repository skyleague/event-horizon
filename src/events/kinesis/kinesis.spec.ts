import { kinesisHandler } from './kinesis.js'

import { asyncForAll, oneOf, tuple, unknown } from '@skyleague/axioms'
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

it('handles kinesis events', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: vi.fn(), schema: {} },
        },
        { kernel: kinesis }
    )
    await asyncForAll(tuple(arbitrary(KinesisStreamEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        kinesis.mockClear()
        kinesis.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(kinesis).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('does not handle non kinesis events', async () => {
    const kinesis = vi.fn()
    const handler = kinesisHandler(
        {
            kinesis: { handler: vi.fn(), schema: {} },
        },
        { kernel: kinesis }
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
                arbitrary(SQSEvent)
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            kinesis.mockClear()
            kinesis.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})
