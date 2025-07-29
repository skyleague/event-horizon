import type { Try } from '@skyleague/axioms'
import type { SnsNotificationSchema, SnsRecordSchema } from '../../aws/sns.js'
import type { SqsRecordSchema } from '../../aws/sqs.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { RawRequest } from '../common/raw-aws.js'
import type { DefaultServices, LambdaContext } from '../types.js'
import { handleSQSEvent, handleSQSMessageGroup } from './handler.js'
import type { SQSEnvelopeHandler, SQSEvent, SQSGroupHandler, SQSHandler } from './types.js'

export function sqsHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Payload extends MaybeGenericParser = undefined,
>(
    definition: D & SQSHandler<Configuration, Service, Profile, Payload>,
    options?: { _kernel?: typeof handleSQSEvent },
): D & EventHandlerFn<Configuration, Service, Profile>
export function sqsHandler<Configuration, Service extends DefaultServices | undefined, Profile extends MaybeGenericParser, D>(
    definition: SQSEnvelopeHandler<Configuration, Service, Profile>,
    options?: { _kernel?: typeof handleSQSEvent },
): D & EventHandlerFn<Configuration, Service, Profile>
export function sqsHandler<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile extends MaybeGenericParser,
    Payload extends MaybeGenericParser,
    D,
>(
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

function fromEnvelope<Configuration, Service extends DefaultServices | undefined, Profile extends MaybeGenericParser>({
    envelope,
}: SQSEnvelopeHandler<Configuration, Service, Profile>): EventHandlerFn<Configuration, Service, Profile> {
    const { services: _services, config: _config, profile: _profile, ...definition } = envelope
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

export function sqsGroupHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Payload extends MaybeGenericParser = undefined,
>(
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
