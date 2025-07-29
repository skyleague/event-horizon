import { SqsSchema as ParserSqsSchema, S3Schema } from '@aws-lambda-powertools/parser/schemas'
import { array, asyncForAll, constant, random, tuple, unknown } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { expect, it, vi } from 'vitest'
import type { SqsSchema } from '../../aws/sqs.js'
import { context } from '../../test/context/context.js'
import { mockLogger, mockMetrics, mockTracer } from '../../test/mock/mock.js'
import { s3Handler } from '../s3/s3.js'
import { sqsHandler } from './sqs.js'

it('handles a simple snapshot', async () => {
    const s3 = vi.fn()

    const logger = mockLogger()
    const tracer = mockTracer()
    const metrics = mockMetrics()

    const handler = sqsHandler({
        envelope: s3Handler({ s3: { handler: s3 }, logger, tracer, metrics }),
    })

    await expect(
        handler(
            {
                Records: [
                    {
                        messageId: 'ca3e7a89-c358-40e5-8aa0-5da01403c267',
                        receiptHandle:
                            'AQEBE7XoI7IQRLF7SrpiW9W4BanmOWe8UtVDbv6/CEZYKf/OktSNIb4j689tQfR4k44V/LY20lZ5VpxYt2GTYCsSLKTcBalTJaRX9CKu/hVqy/23sSNiKxnP56D+VLSn+hU275+AP1h4pUL0d9gLdRB2haX8xiM+LcGfis5Jl8BBXtoxKRF60O87O9/NvCmmXLeqkJuexfyEZNyed0fFCRXFXSjbmThG0OIQgcrGI8glBRGPA8htns58VtXFsSaPYNoqP3p5n6+ewKKVLD0lfm+0DlnLKRa+mjvFBaSer9KK1ff+Aq6zJ6HynPwADj+aF70Hwimc2zImYe51SLEF/E2csYlMNZYI/2qXW0m9R7wJ/XDTV4g2+h+BMTxsKnJQ6NQd',
                        body: '{"Records":[{"eventVersion":"2.1","eventSource":"aws:s3","awsRegion":"us-east-1","eventTime":"2023-04-12T20:43:38.021Z","eventName":"ObjectCreated:Put","userIdentity":{"principalId":"A1YQ72UWCM96UF"},"requestParameters":{"sourceIPAddress":"93.108.161.96"},"responseElements":{"x-amz-request-id":"YMSSR8BZJ2Y99K6P","x-amz-id-2":"6ASrUfj5xpn859fIq+6FXflOex/SKl/rjfiMd7wRzMg/zkHKR22PDpnh7KD3uq//cuOTbdX4DInN5eIs+cR0dY1z2Mc5NDP/"},"s3":{"s3SchemaVersion":"1.0","configurationId":"SNS","bucket":{"name":"xxx","ownerIdentity":{"principalId":"A1YQ72UWCM96UF"},"arn":"arn:aws:s3:::xxx"},"object":{"key":"test.pdf","size":104681,"eTag":"2e3ad1e983318bbd8e73b080e2997980","versionId":"yd3d4HaWOT2zguDLvIQLU6ptDTwKBnQV","sequencer":"00643717F9F8B85354"}}}]}',
                        attributes: {
                            ApproximateReceiveCount: '1',
                            SentTimestamp: '1681332219270',
                            SenderId: 'AIDAJHIPRHEMV73VRJEBU',
                            ApproximateFirstReceiveTimestamp: '1681332239270',
                        },
                        messageAttributes: {},
                        md5OfBody: '16f4460f4477d8d693a5abe94fdbbd73',
                        eventSource: 'aws:sqs',
                        eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:SQS',
                        awsRegion: 'us-east-1',
                    },
                ],
            },
            random(await context()).raw,
        ),
    ).resolves.toBeUndefined()

    expect(s3.mock.calls[0]![0]).toMatchInlineSnapshot(`
      {
        "raw": {
          "awsRegion": "us-east-1",
          "eventName": "ObjectCreated:Put",
          "eventSource": "aws:s3",
          "eventTime": "2023-04-12T20:43:38.021Z",
          "eventVersion": "2.1",
          "requestParameters": {
            "sourceIPAddress": "93.108.161.96",
          },
          "responseElements": {
            "x-amz-id-2": "6ASrUfj5xpn859fIq+6FXflOex/SKl/rjfiMd7wRzMg/zkHKR22PDpnh7KD3uq//cuOTbdX4DInN5eIs+cR0dY1z2Mc5NDP/",
            "x-amz-request-id": "YMSSR8BZJ2Y99K6P",
          },
          "s3": {
            "bucket": {
              "arn": "arn:aws:s3:::xxx",
              "name": "xxx",
              "ownerIdentity": {
                "principalId": "A1YQ72UWCM96UF",
              },
            },
            "configurationId": "SNS",
            "object": {
              "eTag": "2e3ad1e983318bbd8e73b080e2997980",
              "key": "test.pdf",
              "sequencer": "00643717F9F8B85354",
              "size": 104681,
              "versionId": "yd3d4HaWOT2zguDLvIQLU6ptDTwKBnQV",
            },
            "s3SchemaVersion": "1.0",
          },
          "userIdentity": {
            "principalId": "A1YQ72UWCM96UF",
          },
        },
      }
    `)
})

it('handles sqs -> s3 events', async () => {
    const s3 = vi.fn()

    const logger = mockLogger()
    const tracer = mockTracer()
    const metrics = mockMetrics()

    const handler = sqsHandler({
        envelope: s3Handler({ s3: { handler: s3 }, logger, tracer, metrics }),
    })

    await asyncForAll(
        tuple(
            arbitrary(ParserSqsSchema)
                .chain((sqs) => {
                    return tuple(
                        constant(sqs),
                        array(arbitrary(S3Schema), { minLength: sqs.Records.length, maxLength: sqs.Records.length }),
                    )
                })
                .map(([sqs, s3]) => {
                    sqs = structuredClone(sqs)
                    for (const [i, record] of sqs.Records.entries()) {
                        record.body = JSON.stringify(s3[i])
                    }
                    return [sqs, s3] as const
                }),
            unknown(),
            await context(handler),
        ),
        async ([[sqsEvent, s3Events], ret, ctx]) => {
            logger.mockClear()
            tracer.mockClear()
            metrics.mockClear()

            s3.mockClear()
            s3.mockReturnValue(ret)

            const _response = await handler(sqsEvent as SqsSchema, ctx.raw)
            let call = 1
            let loggerOffset = 0
            for (const [i, sqsRecord] of sqsEvent.Records.entries()) {
                expect(handler.logger?.info).toHaveBeenNthCalledWith(2 * i + 1 + loggerOffset, '[sqs] start', {
                    event: expect.objectContaining({
                        raw: sqsRecord,
                    }),
                    item: i,
                })
                for (const [j, record] of (s3Events[i]?.Records ?? []).entries()) {
                    expect(handler.logger?.info).toHaveBeenNthCalledWith(2 * i + 1 + ++loggerOffset, '[s3] start', {
                        event: expect.objectContaining({
                            raw: record,
                        }),
                        item: j,
                    })
                    expect(handler.logger?.info).toHaveBeenNthCalledWith(2 * i + 1 + ++loggerOffset, '[s3] sent', {
                        response: undefined,
                        item: j,
                    })

                    expect(s3).toHaveBeenNthCalledWith(call, { raw: record }, expect.anything())
                    call++
                }
                expect(handler.logger?.info).toHaveBeenNthCalledWith(2 * i + 2 + loggerOffset, '[sqs] sent', {
                    response: undefined,
                    item: i,
                })
            }
        },
    )
}, 10000)
