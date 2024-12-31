import { type Try, eitherAsValue, isLeft, mapLeft, mapRight, mapTry, parallelLimit, tryToEither } from '@skyleague/axioms'
import type { SQSBatchItemFailure, SQSBatchResponse } from 'aws-lambda'
import type { SqsRecordSchema } from '../../aws/sqs/sqs.type.js'
import type { InferFromParser, MaybeGenericParser } from '../../parsers/types.js'
import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'
import { sqsErrorHandler } from './functions/error-handler.js'
import { sqsParseEvent } from './functions/parse-event.js'
import type { SQSEvent, SQSGroupHandler, SQSHandler, SQSMessageGroup } from './types.js'

export async function handleSQSEvent<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser,
>(
    handler: SQSHandler<Configuration, Service, Profile, Payload>,
    events: SqsRecordSchema[],
    context: LambdaContext<Configuration, Service, Profile>,
    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
): Promise<SQSBatchResponse | void> {
    const { sqs } = handler

    const errorHandlerFn = sqsErrorHandler(context)
    const parseEventFn = sqsParseEvent(sqs)
    const ioValidateFn = ioValidate<SQSEvent>()
    const ioLoggerFn = ioLogger({ type: 'sqs' }, context)
    const ioLoggerChildFn = ioLoggerChild(context, context.logger)

    let failures: SQSBatchItemFailure[] | undefined = undefined
    for (const [i, event] of events.entries()) {
        const item = { item: i }

        const sqsEvent = await mapTry(event, (e) => {
            const unvalidatedSQSEvent = parseEventFn.before(e, i)

            ioLoggerChildFn.before({
                messageId: unvalidatedSQSEvent.raw.messageId,
            })

            return ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent, 'payload')
        })

        ioLoggerFn.before(sqsEvent, item)

        const transformed = await mapTry(sqsEvent, (success) => sqs.handler(success, context))

        const eitherTransformed = tryToEither(transformed)
        const response = mapLeft(eitherTransformed, (e) => errorHandlerFn.onError(event, e))

        ioLoggerFn.after(eitherAsValue(response), item)
        ioLoggerChildFn.after()

        if (isLeft(response)) {
            failures ??= []
            failures.push(response.left)
        }
    }
    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
}

export async function handleSQSMessageGroup<
    Configuration,
    Service,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser,
>(
    handler: SQSGroupHandler<Configuration, Service, Profile, Payload>,
    events: SqsRecordSchema[],
    context: LambdaContext<Configuration, Service, Profile>,
    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
): Promise<SQSBatchResponse | void> {
    const { sqs } = handler
    const { parallelism = 1 } = sqs

    const parseEventFn = sqsParseEvent(sqs)
    const ioValidateFn = ioValidate<SQSEvent>()

    let failures: SQSBatchItemFailure[] | undefined = undefined
    const sqsEvents = await Promise.all(
        events.entries().map(async ([i, event]) => {
            const sqsEvent = await mapTry(event, (e) => {
                const unvalidatedSQSEvent = parseEventFn.before(e, i)
                return ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent, 'payload')
            })

            return {
                sqsEvent,
                event,
                i,
            }
        }),
    )

    const messageGroups: Partial<Record<string, SQSMessageGroup<InferFromParser<Payload, unknown>>['records']>> = Object.groupBy(
        sqsEvents.map(({ sqsEvent, event, i }) => ({
            messageGroupId: event.attributes.MessageGroupId ?? 'unknown',
            payload: mapTry(sqsEvent, (e) => e.payload) as Try<InferFromParser<Payload, unknown>>,
            raw: event,
            item: i,
        })),
        ({ messageGroupId }) => messageGroupId,
    )

    const pLimit = parallelLimit(parallelism)
    await Promise.all(
        Object.entries(messageGroups).map(([messageGroupId, records]) =>
            pLimit(async () => {
                const ctx = { ...context }
                const errorHandlerFn = sqsErrorHandler(ctx)
                const ioLoggerFn = ioLogger({ type: 'sqs' }, ctx)
                const ioLoggerChildFn = ioLoggerChild(ctx, ctx.logger)

                ioLoggerChildFn.before({ messageGroupId })

                const messageGroup: SQSMessageGroup<InferFromParser<Payload, unknown>> = {
                    messageGroupId,
                    records: records ?? [],
                }

                ioLoggerFn.before(messageGroup, { messageGroupId })

                const transformed = await mapTry(messageGroup, (success) => sqs.handler(success, ctx))

                const eitherTransformed = tryToEither(transformed)
                const response = mapLeft(eitherTransformed, (e) => (records ?? []).map((r) => errorHandlerFn.onError(r.raw, e)))

                ioLoggerFn.after(eitherAsValue(response), { messageGroupId })
                ioLoggerChildFn.after()

                const messageGroupFailures = eitherAsValue(mapRight(response, (r) => r ?? []))

                if (Array.isArray(messageGroupFailures) && messageGroupFailures.length > 0) {
                    failures ??= []
                    failures.push(...messageGroupFailures)
                }
            }),
        ),
    )

    if (failures !== undefined) {
        return { batchItemFailures: failures }
    }
}
