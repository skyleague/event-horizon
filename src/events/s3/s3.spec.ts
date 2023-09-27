import { s3Handler } from './s3.js'

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

it('handles s3 events', async () => {
    const s3 = vi.fn()
    const handler = s3Handler(
        {
            s3: { handler: vi.fn() },
        },
        { kernel: s3 }
    )
    await asyncForAll(tuple(arbitrary(S3Event), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        s3.mockClear()
        s3.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(s3).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('does not handle non kinesis events', async () => {
    const s3 = vi.fn()
    const handler = s3Handler(
        {
            s3: { handler: vi.fn() },
        },
        { kernel: s3 }
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisStreamEvent),
                // arbitrary(S3Event),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent)
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            s3.mockClear()
            s3.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})
