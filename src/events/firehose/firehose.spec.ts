import { firehoseHandler } from './firehose.js'
import type { FirehoseTransformationEvent } from './types.js'

import { literalSchema, warmerEvent } from '../../../test/schema.js'

import { asyncForAll, oneOf, random, tuple, unknown } from '@skyleague/axioms'
import {
    APIGatewayProxyEvent,
    EventBridgeEvent,
    FirehoseTransformationEvent as FirehoseTransformationEventSchema,
    KinesisStreamEvent,
    S3BatchEvent,
    S3Event,
    SNSEvent,
    SQSEvent,
    SecretRotationEvent,
} from '@skyleague/event-horizon-dev'
import { context } from '@skyleague/event-horizon-dev/test'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi, expectTypeOf } from 'vitest'

it('handles firehose events', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: vi.fn(), schema: {} },
        },
        { kernel: firehose }
    )
    await asyncForAll(
        tuple(arbitrary(FirehoseTransformationEventSchema), unknown(), await context(handler)),
        async ([event, ret, ctx]) => {
            firehose.mockClear()
            firehose.mockReturnValue(ret)

            const response = await handler._options.handler(event, ctx)
            expect(response).toBe(ret)
            expect(firehose).toHaveBeenCalledWith(expect.anything(), event.records, ctx)
        }
    )
})

it('handles schema types', () => {
    const handler = firehoseHandler({
        firehose: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            handler: (request) => {
                expectTypeOf(request).toEqualTypeOf<FirehoseTransformationEvent<'payload'>>()

                return { status: 'Ok', payload: 'result' }
            },
        },
    })
    expectTypeOf(handler.firehose.handler).toEqualTypeOf<
        (request: FirehoseTransformationEvent<'payload'>) => {
            status: 'Ok'
            payload: 'result'
        }
    >()
})

it('handles schema types and gives errors', () => {
    firehoseHandler({
        firehose: {
            schema: { payload: literalSchema<'payload'>(), result: literalSchema<'result'>() },
            // @ts-expect-error handler is not a valid return type
            handler: () => {
                return { status: 'Ok', payload: 'not-result' }
            },
        },
    })
})

it('does not handle non firehose events', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: vi.fn(), schema: {} },
        },
        { kernel: firehose }
    )
    await asyncForAll(
        tuple(
            oneOf(
                arbitrary(EventBridgeEvent),
                // arbitrary(FirehoseTransformationEvent),
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
            firehose.mockClear()
            firehose.mockReturnValue(ret)
            await expect(async () => handler._options.handler(event as any, ctx)).rejects.toThrowError(
                /Lambda was invoked with an unexpected event type/
            )
        }
    )
})

it('warmup should early exit', async () => {
    const firehose = vi.fn()
    const handler = firehoseHandler(
        {
            firehose: { handler: firehose, schema: {} },
        },
        { kernel: firehose }
    )

    await expect(handler(warmerEvent, random(await context()).raw)).resolves.toBe(undefined)
    expect(firehose).not.toHaveBeenCalled()
})
