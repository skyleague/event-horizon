import { secretRotationHandler } from './secret-rotation.js'

import { warmerEvent } from '../../../test/schema.js'

import type { SecretsManager } from '@aws-sdk/client-secrets-manager'
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

it('handles secret rotation events', async () => {
    const secretRotation = vi.fn()
    const services = { secretsManager: vi.fn() as unknown as SecretsManager }
    const handler = secretRotationHandler(
        {
            services,
            secretRotation: { handler: vi.fn() },
        },
        { kernel: secretRotation }
    )
    await asyncForAll(tuple(arbitrary(SecretRotationEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        secretRotation.mockClear()
        secretRotation.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(secretRotation).toHaveBeenCalledWith(expect.anything(), event, ctx)
    })
})

it('does not handle non secret rotation events', async () => {
    const secretRotation = vi.fn()
    const services = { secretsManager: vi.fn() as unknown as SecretsManager }
    const handler = secretRotationHandler(
        {
            services,
            secretRotation: { handler: vi.fn() },
        },
        { kernel: secretRotation }
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
                // arbitrary(SecretRotationEvent),
                arbitrary(SNSEvent),
                arbitrary(SQSEvent)
            ),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            secretRotation.mockClear()
            secretRotation.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const secretRotation = vi.fn()
    const services = { secretsManager: vi.fn() as unknown as SecretsManager }
    const handler = secretRotationHandler(
        {
            services,
            secretRotation: { handler: secretRotation },
        },
        { kernel: secretRotation }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(secretRotation).not.toHaveBeenCalled()
})
