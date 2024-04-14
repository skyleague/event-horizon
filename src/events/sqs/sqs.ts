import { handleSQSEvent } from './handler.js'
import { handleSQSMessageGroup } from './handler.js'
import type { SQSHandler, SQSMessageGrouping } from './types.js'

import { EventError } from '../../errors/event-error/event-error.js'
import { eventHandler, type EventHandlerFn } from '../common/event.js'
import type { DefaultServices } from '../types.js'

import type { SQSRecord } from 'aws-lambda'

export type SQSKernel<MessageGrouping> = MessageGrouping extends { by: 'message-group-id' }
    ? typeof handleSQSMessageGroup
    : typeof handleSQSEvent

export function sqsHandler<
    Configuration,
    Service extends DefaultServices | undefined,
    Profile,
    Payload,
    D,
    MessageGrouping extends SQSMessageGrouping = {},
>(
    definition: D & SQSHandler<Configuration, Service, Profile, Payload, MessageGrouping>,
    { kernel }: { kernel?: SQSKernel<MessageGrouping> } = {}
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            const determinedKernel =
                kernel ?? (definition.sqs.messageGrouping === undefined ? handleSQSEvent : handleSQSMessageGroup)

            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: SQSRecord[] = []
                const other = []
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
                return determinedKernel(definition, records, context)
            }
            throw EventError.unexpectedEventType()
        },
    }) as D & EventHandlerFn<Configuration, Service, Profile, Payload>
}
