import { sqsHandler } from './sqs.js'
import type { SQSEvent, SQSMessageGroup } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import {
    APIGatewayProxyEvent,
    EventBridgeEvent,
    FirehoseTransformationEvent,
    KinesisStreamEvent,
    S3BatchEvent,
    S3Event,
    SNSEvent,
    SQSEvent as SQSEventSchema,
    SecretRotationEvent,
} from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import { arbitrary } from '@skyleague/therefore'
import type { SQSBatchItemFailure } from 'aws-lambda'
import { expect, it, vi, expectTypeOf } from 'vitest'

it('handles sqs events', async () => {
    const sqs = vi.fn()
    const handler = sqsHandler(
        {
            sqs: { handler: vi.fn(), schema: {} },
        },
        { kernel: sqs }
    )
    await asyncForAll(tuple(arbitrary(SQSEventSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
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

it('handles sqs events - message grouping', async () => {
    const sqs = vi.fn()
    const handler = sqsHandler(
        {
            sqs: { handler: vi.fn(), schema: {}, messageGrouping: { by: 'message-group-id' } },
        },
        { kernel: sqs }
    )
    await asyncForAll(tuple(arbitrary(SQSEventSchema), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        sqs.mockClear()
        sqs.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})

it('handles schema types - message grouping', () => {
    const handler = sqsHandler({
        sqs: {
            messageGrouping: { by: 'message-group-id' },
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
    const handler = sqsHandler(
        {
            sqs: { handler: vi.fn(), schema: {} },
        },
        { kernel: sqs }
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
                arbitrary(SNSEvent)
                // arbitrary(SQSEvent)
            ).filter((e) => !('Records' in e) || e.Records.length > 0),
            unknown(),
            await context(handler)
        ),
        async ([event, ret, ctx]) => {
            sqs.mockClear()
            sqs.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const sqs = vi.fn()
    const handler = sqsHandler(
        {
            sqs: { handler: sqs, schema: {} },
        },
        { kernel: sqs }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(sqs).not.toHaveBeenCalled()
})
