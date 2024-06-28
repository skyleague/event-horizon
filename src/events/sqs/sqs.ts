import type { Try } from '@skyleague/axioms'
import type { SnsNotificationSchema, SnsRecordSchema } from '../../aws/sns/sns.type.js'
import type {} from '../../aws/sns/sns.type.js'
import type { SqsRecordSchema } from '../../aws/sqs/sqs.type.js'
import { EventError } from '../../errors/event-error/event-error.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { RawRequest } from '../common/raw-aws.js'
import type { LambdaContext } from '../types.js'
import type { DefaultServices } from '../types.js'
import { handleSQSEvent } from './handler.js'
import { handleSQSMessageGroup } from './handler.js'
import type { SQSEnvelopeHandler, SQSEvent, SQSHandler } from './types.js'
import type { SQSGroupHandler } from './types.js'

export function sqsHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & SQSHandler<Configuration, Service, Profile, Payload>,
    options?: { _kernel?: typeof handleSQSEvent },
): D & EventHandlerFn<Configuration, Service, Profile>
export function sqsHandler<Configuration, Service extends DefaultServices | undefined, Profile, D>(
    definition: SQSEnvelopeHandler<Configuration, Service, Profile>,
    options?: { _kernel?: typeof handleSQSEvent },
): D & EventHandlerFn<Configuration, Service, Profile>
export function sqsHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & (SQSHandler<Configuration, Service, Profile, Payload> | SQSEnvelopeHandler<Configuration, Service, Profile>),
    { _kernel = handleSQSEvent }: { _kernel?: typeof handleSQSEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    if ('envelope' in definition) {
        return fromEnvelope(definition) as unknown as D & EventHandlerFn<Configuration, Service, Profile>
    }
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: SqsRecordSchema[] = []
                const other: unknown[] = []
                for (const record of request.Records) {
                    if ('messageAttributes' in record) {
                        records.push(record)
                    } else {
                        other.push(record)
                    }
                }
                if (other.length > 0) {
                    throw EventError.unexpectedEventType()
                }
                return _kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    })
}

function fromEnvelope<Configuration, Service extends DefaultServices | undefined, Profile>({
    envelope,
}: SQSEnvelopeHandler<Configuration, Service, Profile>): EventHandlerFn<Configuration, Service, Profile> {
    const { services, config, profile, ...definition } = envelope
    return sqsHandler({
        ...definition,
        sqs: {
            schema: {
                // don't check the actual payload, we'll just assume it is correct,
            },
            payloadType: 'json',
            handler: async (
                request: SQSEvent<unknown>,
                ctx: LambdaContext<Configuration, Service, Profile>,
            ): Promise<Try<void>> => {
                if ('sns' in envelope) {
                    await envelope(
                        {
                            Records: [
                                {
                                    Sns: request.payload as SnsNotificationSchema,
                                    EventSource: 'aws:sns',
                                    EventVersion: '',
                                    EventSubscriptionArn: '',
                                } satisfies SnsRecordSchema,
                            ],
                        },
                        ctx.raw,
                    )
                } else {
                    await envelope(request.payload as RawRequest, ctx.raw)
                }
            },
        },
    })
}

export function sqsGroupHandler<Configuration, Service extends DefaultServices | undefined, Profile, Payload, D>(
    definition: D & SQSGroupHandler<Configuration, Service, Profile, Payload>,
    { _kernel = handleSQSMessageGroup }: { _kernel?: typeof handleSQSMessageGroup } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: SqsRecordSchema[] = []
                const other: unknown[] = []
                for (const record of request.Records) {
                    if ('messageAttributes' in record) {
                        records.push(record)
                    } else {
                        other.push(record)
                    }
                }
                if (other.length > 0) {
                    throw EventError.unexpectedEventType()
                }
                return _kernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    })
}
