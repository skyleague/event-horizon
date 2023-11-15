import { snsHandler } from './sns.js'

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

it('handles sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { kernel: sns }
    )
    await asyncForAll(tuple(arbitrary(SNSEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        sns.mockClear()
        sns.mockReturnValue(ret)

        const response = await handler._options.handler(event as any, ctx)
        expect(response).toBe(ret)
        expect(sns).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('does not handle non sns events', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: vi.fn(), schema: {} },
        },
        { kernel: sns }
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                arbitrary(FirehoseTransformationEvent),
                arbitrary(APIGatewayProxyEvent),
                arbitrary(KinesisStreamEvent),
                arbitrary(S3Event),
                arbitrary(S3BatchEvent),
                arbitrary(SecretRotationEvent),
                // arbitrary(SNSEvent)
                arbitrary(SQSEvent)
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            sns.mockClear()
            sns.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const sns = vi.fn()
    const handler = snsHandler(
        {
            sns: { handler: sns, schema: {} },
        },
        { kernel: sns }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(sns).not.toHaveBeenCalled()
})
