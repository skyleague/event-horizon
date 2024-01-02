import { rawHandler } from './raw.js'

import { warmerEvent } from '../../../test/schema.js'

import { asyncForAll, json, oneOf, random, tuple, unknown } from '@skyleague/axioms'
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

it('does handle raw events', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: vi.fn(), schema: {} },
        },
        { kernel: raw }
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
                arbitrary(SNSEvent),
                arbitrary(SQSEvent),
                json(),
                unknown()
            ),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            raw.mockClear()
            raw.mockReturnValue(ret)
            const response = await handler._options.handler(event as any, ctx)
            expect(response).toBe(ret)
            expect(raw).toHaveBeenCalledWith(expect.anything(), event, ctx)
        }
    )
})

it('warmup should early exit', async () => {
    const raw = vi.fn()
    const handler = rawHandler(
        {
            raw: { handler: raw, schema: {} },
        },
        { kernel: raw }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(raw).not.toHaveBeenCalled()
})
