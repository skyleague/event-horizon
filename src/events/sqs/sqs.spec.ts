import { sqsHandler } from './sqs.js'
import type { SQSEvent as SQSEVentType, SQSMessageGroup } from './types.js'

import { asyncForAll, groupBy, oneOf, tuple, unknown } from '@skyleague/axioms'
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

it('handles sqs events', async () => {
    const sqs = vi.fn()
    const handler = sqsHandler(
        {
            sqs: { handler: vi.fn(), schema: {} },
        },
        { kernel: sqs }
    )
    await asyncForAll(tuple(arbitrary(SQSEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        sqs.mockClear()
        sqs.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
})
it('handles sqs events - message grouping', async () => {
    const sqs = vi.fn()
    const handler = sqsHandler(
        {
            sqs: { handler: vi.fn(), schema: {}, messageGrouping: { by: 'messageGroupId' } },
        },
        { kernel: sqs }
    )
    await asyncForAll(tuple(arbitrary(SQSEvent), unknown(), await context(handler)), async ([event, ret, ctx]) => {
        sqs.mockClear()
        sqs.mockReturnValue(ret)

        const response = await handler._options.handler(event, ctx)
        expect(response).toBe(ret)
        expect(sqs).toHaveBeenCalledWith(expect.anything(), event.Records, ctx)
    })
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

it('does not handle non sqs events - message grouping', async () => {
    const sqs = vi.fn()
    const handler = sqsHandler(
        {
            sqs: { handler: vi.fn(), schema: {}, messageGrouping: { by: 'messageGroupId' } },
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

it('determines the kernel based on the message grouping', async () => {
    const sqsRecordHandler = vi.fn()
    const recordHandler = sqsHandler({
        sqs: {
            handler: (...input) => {
                const _input: SQSEVentType = input[0]
                return sqsRecordHandler(...input)
            },
            schema: {},
            payloadType: 'plaintext',
        },
    })

    const sqsMessageGroupHandler = vi.fn()
    const messageGroupHandler = sqsHandler({
        sqs: {
            handler: (...input) => {
                const _input: SQSMessageGroup = input[0]
                return sqsMessageGroupHandler(...input)
            },
            schema: {},
            payloadType: 'plaintext',
            messageGrouping: { by: 'messageGroupId' },
        },
    })

    await asyncForAll(
        tuple(arbitrary(SQSEvent), await context(recordHandler), await context(messageGroupHandler)),
        async ([event, recordCtx, messageGroupCtx]) => {
            sqsRecordHandler.mockReset()
            sqsMessageGroupHandler.mockReset()

            await recordHandler._options.handler(event, recordCtx)
            if (event.Records.length > 0) {
                expect(sqsRecordHandler).toHaveBeenCalledTimes(event.Records.length)
            } else {
                expect(sqsRecordHandler).not.toHaveBeenCalled()
            }
            expect(sqsMessageGroupHandler).not.toHaveBeenCalled()

            sqsRecordHandler.mockReset()
            sqsMessageGroupHandler.mockReset()

            await messageGroupHandler._options.handler(event, messageGroupCtx)
            if (event.Records.length > 0) {
                expect(sqsMessageGroupHandler).toHaveBeenCalledTimes(
                    Object.keys(groupBy(event.Records, (record) => record.attributes.MessageGroupId ?? 'unknown')).length
                )
            } else {
                expect(sqsMessageGroupHandler).not.toHaveBeenCalled()
            }
            expect(sqsRecordHandler).not.toHaveBeenCalled()
        }
    )
})
