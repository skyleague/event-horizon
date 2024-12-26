import { EventBridgeSchema, SqsSchema } from '@aws-lambda-powertools/parser/schemas'
import { array, asyncForAll, constant, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import { context } from '../../test/context/context.js'
import { mockLogger, mockMetrics, mockTracer } from '../../test/mock/mock.js'
import { eventBridgeHandler } from '../eventbridge/eventbridge.js'
import { sqsHandler } from './sqs.js'

it('handles sqs -> eventbridge events', async () => {
    const eventBridge = vi.fn()

    const logger = mockLogger()
    const tracer = mockTracer()
    const metrics = mockMetrics()

    const handler = sqsHandler({
        envelope: eventBridgeHandler({
            eventBridge: { handler: eventBridge, schema: {}, payloadType: 'plaintext' },
            logger,
            tracer,
            metrics,
        }),
    })

    await asyncForAll(
        tuple(
            arbitrary(SqsSchema)
                .chain((sqs) => {
                    return tuple(
                        constant(sqs),
                        array(arbitrary(EventBridgeSchema), { minLength: sqs.Records.length, maxLength: sqs.Records.length }),
                    )
                })
                .map(([sqs, eb]) => {
                    sqs = structuredClone(sqs)
                    for (const [i, record] of sqs.Records.entries()) {
                        record.body = JSON.stringify(eb[i])
                    }
                    return [sqs, eb] as const
                }),
            unknown(),
            await context(handler),
        ),
        async ([[sqsEvent, ebEvents], ret, ctx]) => {
            logger.mockClear()
            tracer.mockClear()
            metrics.mockClear()

            eventBridge.mockClear()
            eventBridge.mockReturnValue(ret)

            const _response = await handler(sqsEvent, ctx.raw)
            for (const [i, sqsRecord] of sqsEvent.Records.entries()) {
                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 1, '[sqs] start', {
                    event: expect.objectContaining({
                        raw: sqsRecord,
                    }),
                    item: i,
                })

                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 2, '[eventbridge] start', {
                    event: expect.objectContaining({
                        payload: ebEvents[i]?.detail,
                        raw: ebEvents[i],
                    }),
                })
                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 3, '[eventbridge] sent', {
                    response: ret,
                })

                expect(eventBridge).toHaveBeenNthCalledWith(
                    i + 1,
                    { payload: ebEvents[i]?.detail, raw: ebEvents[i] },
                    expect.anything(),
                )

                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 4, '[sqs] sent', {
                    response: undefined,
                    item: i,
                })
            }
        },
    )
})
