import type { SnsRecordSchema } from '../../aws/sns.js'
import { EventError } from '../../errors/event-error/event-error.js'
import type { MaybeGenericParser } from '../../parsers/types.js'
import { type EventHandlerFn, eventHandler } from '../common/event.js'
import type { DefaultServices } from '../types.js'
import { handleSNSEvent } from './handler.js'
import type { SNSHandler } from './types.js'

export function snsHandler<
    D,
    Configuration = undefined,
    Service extends DefaultServices | undefined = undefined,
    Profile extends MaybeGenericParser = undefined,
    Payload extends MaybeGenericParser = undefined,
>(
    definition: D & SNSHandler<Configuration, Service, Profile, Payload>,
    { _kernel = handleSNSEvent }: { _kernel?: typeof handleSNSEvent } = {},
): D & EventHandlerFn<Configuration, Service, Profile> {
    return eventHandler(definition, {
        handler: (request, context) => {
            if (typeof request === 'object' && request !== null && 'Records' in request) {
                const records: SnsRecordSchema[] = []
                const other: unknown[] = []
                for (const record of request.Records) {
                    if ('Sns' in record) {
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
