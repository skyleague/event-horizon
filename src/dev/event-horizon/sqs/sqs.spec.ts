import { type Try, forAll } from '@skyleague/axioms'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { z } from 'zod'
import { SqsRecordSchema } from '../../../aws/sqs/sqs.type.js'
import { sqsGroupHandler, sqsHandler } from '../../../events/sqs/sqs.js'
import type { SQSEvent } from '../../../events/sqs/types.js'
import { sqsEvent, sqsGroupEvent } from './sqs.js'

describe('sqsHandler', () => {
    it('should properly validate and type SQS event payload', () => {
        forAll(
            sqsEvent(
                sqsHandler({
                    sqs: {
                        schema: {
                            payload: z.literal('payload'),
                        },
                        handler: ({ payload }) => {
                            expectTypeOf(payload).toEqualTypeOf<'payload'>()
                        },
                    },
                }),
            ),
            (request) => {
                expect(request.payload).toEqual('payload')
                expect(request.messageGroupId).toBeDefined()
                expect(request.item).toBeDefined()

                expect(request.raw.attributes.MessageGroupId).toEqual(request.messageGroupId)
                expect(request.raw.body).toEqual(JSON.stringify(request.payload))
                expect(SqsRecordSchema.is(request.raw)).toBe(true)

                expectTypeOf(request.payload).toEqualTypeOf<'payload'>()
            },
        )
    })
})

describe('sqsGroupHandler', () => {
    it('should properly validate and type SQS event payload', () => {
        forAll(
            sqsGroupEvent(
                sqsGroupHandler({
                    sqs: {
                        schema: {
                            payload: z.literal('payload'),
                        },
                        handler: (event) => {
                            expectTypeOf(event.records).toEqualTypeOf<SQSEvent<Try<'payload'>>[]>()
                        },
                    },
                }),
            ),
            (request) => {
                for (const record of request.records) {
                    expect(record.payload).toEqual('payload')
                    expect(record.messageGroupId).toBeDefined()
                    expect(record.item).toBeDefined()
                    expect(SqsRecordSchema.is(record.raw)).toBe(true)
                    expect(record.raw.attributes.MessageGroupId).toEqual(record.messageGroupId)
                    expect(record.raw.body).toEqual(JSON.stringify(record.payload))
                }
                expectTypeOf(request.records).toEqualTypeOf<SQSEvent<Try<'payload'>>[]>()
            },
        )
    })
})
