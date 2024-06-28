import { array, asyncForAll, constant, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import { SnsRecordSchema } from '../../aws/sns/sns.type.js'
import { SqsSchema } from '../../aws/sqs/sqs.type.js'
import { context } from '../../test/context/context.js'
import { mockLogger, mockMetrics, mockTracer } from '../../test/mock/mock.js'
import { snsHandler } from '../sns/sns.js'
import { sqsHandler } from './sqs.js'

it('handles a simple snapshot', async () => {
    const sns = vi.fn()

    const logger = mockLogger()
    const tracer = mockTracer()
    const metrics = mockMetrics()

    const handler = sqsHandler({
        envelope: snsHandler({ sns: { handler: sns, schema: {} }, logger, tracer, metrics }),
    })

    await expect(
        handler(
            {
                Records: [
                    {
                        messageId: '79406a00-bf15-46ca-978c-22c3613fcb30',
                        receiptHandle:
                            'AQEB3fkqlBqq239bMCAHIr5mZkxJYKtxsTTy1lMImmpY7zqpQdfcAE8zFiuRh7X5ciROy24taT2rRXfuJFN/yEUVcQ6d5CIOCEK4htmRJJOHIyGdZPAm2NUUG5nNn2aEzgfzVvrkPBsrCbr7XTzK5s6eUZNH/Nn9AJtHKHpzweRK34Bon9OU/mvyIT7EJbwHPsdhL14NrCp8pLWBiIhkaJkG2G6gPO89dwHtGVUARJL+zP70AuIu/f7QgmPtY2eeE4AVbcUT1qaIlSGHUXxoHq/VMHLd/c4zWl0EXQOo/90DbyCUMejTIKL7N15YfkHoQDHprvMiAr9S75cdMiNOduiHzZLg/qVcv4kxsksKLFMKjwlzmYuQYy2KslVGwoHMd4PD',
                        body: '{\n  "Type" : "Notification",\n  "MessageId" : "d88d4479-6ec0-54fe-b63f-1cf9df4bb16e",\n  "TopicArn" : "arn:aws:sns:eu-west-1:231436140809:powertools265",\n  "Message" : "{\\"message\\": \\"hello world\\", \\"username\\": \\"lessa\\"}",\n  "Timestamp" : "2021-01-19T10:07:07.287Z",\n  "SignatureVersion" : "1",\n  "Signature" : "tEo2i6Lw6/Dr7Jdlulh0sXgnkF0idd3hqs8QZCorQpzkIWVOuu583NT0Gv0epuZD1Bo+tex6NgP5p6415yNVujGHJKnkrA9ztzXaVgFiol8rf8AFGQbmb7RsM9BqATQUJeg9nCTe0jksmWXmjxEFr8XKyyRuQBwSlRTngAvOw8jUnCe1vyYD5xPec1xpfOEGLi5BqSog+6tBtsry3oAtcENX8SV1tVuMpp6D+UrrU8xNT/5D70uRDppkPE3vq+t7rR0fVSdQRdUV9KmQD2bflA1Dyb2y37EzwJOMHDDQ82aOhj/JmPxvEAlV8RkZl6J0HIveraRy9wbNLbI7jpiOCw==",\n  "SigningCertURL" : "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-010a507c1833636cd94bdb98bd93083a.pem",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:231436140809:powertools265:15189ad7-870e-40e5-a7dd-a48898cd9f86"\n}',
                        attributes: {
                            ApproximateReceiveCount: '1',
                            SentTimestamp: '1611050827340',
                            SenderId: 'AIDAISMY7JYY5F7RTT6AO',
                            ApproximateFirstReceiveTimestamp: '1611050827344',
                        },
                        messageAttributes: {},
                        md5OfBody: '8910bdaaf9a30a607f7891037d4af0b0',
                        eventSource: 'aws:sqs',
                        eventSourceARN: 'arn:aws:sqs:eu-west-1:231436140809:powertools265',
                        awsRegion: 'eu-west-1',
                    },
                ],
            },
            random(await context()).raw,
        ),
    ).resolves.toBeUndefined()

    expect(sns.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "payload": {
          "message": "hello world",
          "username": "lessa",
        },
        "raw": {
          "Message": "{"message": "hello world", "username": "lessa"}",
          "MessageId": "d88d4479-6ec0-54fe-b63f-1cf9df4bb16e",
          "Signature": "tEo2i6Lw6/Dr7Jdlulh0sXgnkF0idd3hqs8QZCorQpzkIWVOuu583NT0Gv0epuZD1Bo+tex6NgP5p6415yNVujGHJKnkrA9ztzXaVgFiol8rf8AFGQbmb7RsM9BqATQUJeg9nCTe0jksmWXmjxEFr8XKyyRuQBwSlRTngAvOw8jUnCe1vyYD5xPec1xpfOEGLi5BqSog+6tBtsry3oAtcENX8SV1tVuMpp6D+UrrU8xNT/5D70uRDppkPE3vq+t7rR0fVSdQRdUV9KmQD2bflA1Dyb2y37EzwJOMHDDQ82aOhj/JmPxvEAlV8RkZl6J0HIveraRy9wbNLbI7jpiOCw==",
          "SignatureVersion": "1",
          "SigningCertURL": "https://sns.eu-west-1.amazonaws.com/SimpleNotificationService-010a507c1833636cd94bdb98bd93083a.pem",
          "Timestamp": "2021-01-19T10:07:07.287Z",
          "TopicArn": "arn:aws:sns:eu-west-1:231436140809:powertools265",
          "Type": "Notification",
          "UnsubscribeURL": "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:231436140809:powertools265:15189ad7-870e-40e5-a7dd-a48898cd9f86",
        },
      }
    `)
})

it('handles a fifo simple snapshot', async () => {
    const sns = vi.fn()

    const logger = mockLogger()
    const tracer = mockTracer()
    const metrics = mockMetrics()

    const handler = sqsHandler({
        envelope: snsHandler({ sns: { handler: sns, schema: {} }, logger, tracer, metrics }),
    })

    await expect(
        handler(
            {
                Records: [
                    {
                        messageId: '69bc4bbd-ed69-4325-a434-85c3b428ceab',
                        receiptHandle:
                            'AQEBbfAqjhrgIdW3HGWYPz57mdDatG/dT9LZhRPAsNQ1pJmw495w4esDc8ZSbOwMZuPBol7wtiNWug8U25GpSQDDLY1qv//8/lfmdzXOiprG6xRVeiXSHj0j731rJQ3xo+GPdGjOzjIxI09CrE3HtZ4lpXY9NjjHzP8hdxkCLlbttumc8hDBUR365/Tk+GfV2nNP9qvZtLGEbKCdTm/GYdTSoAr+ML9HnnGrS9T25Md71ASiZMI4DZqptN6g7CYYojFPs1LVM9o1258ferA72zbNoQ==',
                        body: '{\n  "Type" : "Notification",\n  "MessageId" : "a7c9d2fa-77fa-5184-9de9-89391027cc7d",\n  "SequenceNumber" : "10000000000000004000",\n  "TopicArn" : "arn:aws:sns:eu-west-1:231436140809:Test.fifo",\n  "Message" : "{\\"message\\": \\"hello world\\", \\"username\\": \\"lessa\\"}",\n  "Timestamp" : "2022-10-14T13:35:25.419Z",\n  "UnsubscribeURL" : "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:231436140809:Test.fifo:bb81d3de-a0f9-46e4-b619-d3152a4d545f"\n}',
                        attributes: {
                            ApproximateReceiveCount: '1',
                            SentTimestamp: '1665754525442',
                            SequenceNumber: '18873177232222703872',
                            MessageGroupId: 'powertools-test',
                            SenderId: 'AIDAWYJAWPFU7SUQGUJC6',
                            MessageDeduplicationId: '4e0a0f61eed277a4b9e4c01d5722b07b0725e42fe782102abee5711adfac701f',
                            ApproximateFirstReceiveTimestamp: '1665754525442',
                        },
                        messageAttributes: {},
                        md5OfBody: 'f3c788e623445e3feb263e80c1bffc0b',
                        eventSource: 'aws:sqs',
                        eventSourceARN: 'arn:aws:sqs:eu-west-1:231436140809:Test.fifo',
                        awsRegion: 'eu-west-1',
                    },
                ],
            },
            random(await context()).raw,
        ),
    ).resolves.toBeUndefined()

    expect(sns.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "payload": {
          "message": "hello world",
          "username": "lessa",
        },
        "raw": {
          "Message": "{"message": "hello world", "username": "lessa"}",
          "MessageId": "a7c9d2fa-77fa-5184-9de9-89391027cc7d",
          "SequenceNumber": "10000000000000004000",
          "Timestamp": "2022-10-14T13:35:25.419Z",
          "TopicArn": "arn:aws:sns:eu-west-1:231436140809:Test.fifo",
          "Type": "Notification",
          "UnsubscribeURL": "https://sns.eu-west-1.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:eu-west-1:231436140809:Test.fifo:bb81d3de-a0f9-46e4-b619-d3152a4d545f",
        },
      }
    `)
})

it('handles sqs -> sns events', async () => {
    const sns = vi.fn()

    const logger = mockLogger()
    const tracer = mockTracer()
    const metrics = mockMetrics()

    const handler = sqsHandler({
        envelope: snsHandler({ sns: { handler: sns, schema: {}, payloadType: 'plaintext' }, logger, tracer, metrics }),
    })

    await asyncForAll(
        tuple(
            arbitrary(SqsSchema)
                .chain((sqs) => {
                    return tuple(
                        constant(sqs),
                        array(arbitrary(SnsRecordSchema), { minLength: sqs.Records.length, maxLength: sqs.Records.length }),
                    )
                })
                .map(([sqs, sns]) => {
                    sqs = structuredClone(sqs)
                    for (const [i, record] of sqs.Records.entries()) {
                        record.body = JSON.stringify(sns[i]?.Sns)
                    }
                    return [sqs, sns] as const
                }),
            unknown(),
            await context(handler),
        ),
        async ([[sqsEvent, snsEvents], ret, ctx]) => {
            logger.mockClear()
            tracer.mockClear()
            metrics.mockClear()

            sns.mockClear()
            sns.mockReturnValue(ret)

            const _response = await handler(sqsEvent, ctx.raw)
            for (const [i, sqsRecord] of sqsEvent.Records.entries()) {
                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 1, '[sqs] start', {
                    event: expect.objectContaining({
                        raw: sqsRecord,
                    }),
                    item: i,
                })

                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 2, '[sns] start', {
                    event: expect.objectContaining({
                        raw: snsEvents[i]?.Sns,
                    }),
                    item: 0,
                })
                expect(handler.logger?.info).toHaveBeenNthCalledWith(4 * i + 3, '[sns] sent', {
                    response: undefined,
                    item: 0,
                })

                expect(sns).toHaveBeenNthCalledWith(
                    i + 1,
                    { payload: snsEvents[i]?.Sns.Message, raw: snsEvents[i]?.Sns },
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
