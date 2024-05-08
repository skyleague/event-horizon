import { ioLoggerChild } from '../functions/io-logger-child.js'
import { ioLogger } from '../functions/io-logger.js'
import { ioValidate } from '../functions/io-validate.js'
import type { LambdaContext } from '../types.js'
import { sqsErrorHandler } from './functions/error-handler.js'
import { sqsParseEvent } from './functions/parse-event.js'
import type { SQSEvent, SQSHandler, SQSMessageGroup, SQSMessageGrouping, SQSPayload } from './types.js'

import {
    type Try,
    eitherAsValue,
    enumerate,
    groupBy,
    isLeft,
    map,
    mapLeft,
    mapRight,
    mapTry,
    parallelLimit,
    tryToEither,
} from '@skyleague/axioms'
import type { SQSBatchItemFailure, SQSBatchResponse } from 'aws-lambda'
import type { SqsRecordSchema } from '../../dev/aws/sqs/sqs.type.js'

export async function handleSQSEvent<Configuration, Service, Profile, Payload>(
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
    for (const [i, event] of enumerate(events)) {
        const item = { item: i }

        const sqsEvent = mapTry(event, (e) => {
            const unvalidatedSQSEvent = parseEventFn.before(e, i)

            ioLoggerChildFn.before({
                messageId: unvalidatedSQSEvent.raw.messageId,
            })

            return ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent, 'payload')
        })

        ioLoggerFn.before(sqsEvent, item)

        const transformed = await mapTry(sqsEvent, (success) => sqs.handler(success as SQSPayload<never, Payload>, context))

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

export async function handleSQSMessageGroup<Configuration, Service, Profile, Payload, MessageGrouping extends SQSMessageGrouping>(
    handler: SQSHandler<Configuration, Service, Profile, Payload, MessageGrouping>,
    events: SqsRecordSchema[],
    context: LambdaContext<Configuration, Service, Profile>,
    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
): Promise<SQSBatchResponse | void> {
    const { sqs } = handler

    const parseEventFn = sqsParseEvent(sqs)
    const ioValidateFn = ioValidate<SQSEvent>()

    let failures: SQSBatchItemFailure[] | undefined = undefined
    const messageGroups: Record<string, SQSMessageGroup<Payload>['records']> = groupBy(
        map(enumerate(events), ([i, event]) => {
            const sqsEvent = mapTry(event, (e) => {
                const unvalidatedSQSEvent = parseEventFn.before(e, i)

                return ioValidateFn.before(sqs.schema.payload, unvalidatedSQSEvent, 'payload')
            })

            return {
                messageGroupId: event.attributes.MessageGroupId ?? 'unknown',
                payload: mapTry(sqsEvent, (e) => e.payload) as Try<Payload>,
                raw: event,
                item: i,
            }
        }),
        ({ messageGroupId }) => messageGroupId,
    )

    const pLimit = parallelLimit(sqs.messageGrouping?.parallelism ?? 1)
    await Promise.all(
        Object.entries(messageGroups).map(([messageGroupId, records]) =>
            pLimit(async () => {
                const ctx = { ...context }
                const errorHandlerFn = sqsErrorHandler(ctx)
                const ioLoggerFn = ioLogger({ type: 'sqs' }, ctx)
                const ioLoggerChildFn = ioLoggerChild(ctx, ctx.logger)

                ioLoggerChildFn.before({ messageGroupId })

                const messageGroup: SQSMessageGroup<Payload> = {
                    messageGroupId,
                    records,
                }

                ioLoggerFn.before(messageGroup, { messageGroupId })

                const transformed = (await mapTry(
                    messageGroup,
                    (success) => sqs.handler(success as SQSPayload<MessageGrouping, Payload>, ctx),
                    // biome-ignore lint/suspicious/noConfusingVoidType: this is the real type we want here
                )) as Try<SQSBatchItemFailure[] | void>

                const eitherTransformed = tryToEither(transformed)
                const response = mapLeft(eitherTransformed, (e) => records.map((r) => errorHandlerFn.onError(r.raw, e)))

                ioLoggerFn.after(eitherAsValue(response), { messageGroupId })
                ioLoggerChildFn.after()

                const messageGroupFailures = eitherAsValue(mapRight(response, (r) => r ?? []))

                if (messageGroupFailures.length > 0) {
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
