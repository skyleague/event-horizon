import type { PutEventsCommandInput } from '@aws-sdk/client-eventbridge'
import { omitUndefined } from '@skyleague/axioms'
import type { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'

export type PutEventsRequestEntry = {
    time?: Date
    source: string
    resources?: string[]
    'detail-type': string
    detail: string
    eventBusName?: string
    traceHeader?: string
}
export type EventBridgePutEvent<T extends EventBridgeSchema = EventBridgeSchema> = Omit<
    Partial<PutEventsRequestEntry>,
    'detail-type' | 'detail'
> &
    Pick<T, 'detail-type' | 'detail'>

type EventEntriesParams<Events extends EventBridgePutEvent[]> = {
    events: Events
} & (Events extends Array<infer U>
    ? U extends { source: string }
        ? { source?: string }
        : { source: string }
    : { source: string }) &
    (Events extends Array<infer U>
        ? U extends { eventBusName: string }
            ? { eventBusName?: string }
            : { eventBusName: string }
        : { eventBusName: string })

export function eventEntries<Events extends EventBridgePutEvent[]>({
    eventBusName,
    events,
    source,
}: EventEntriesParams<Events>): PutEventsCommandInput {
    return {
        Entries: (Array.isArray(events) ? events : [events]).map((e) =>
            omitUndefined({
                Time: e.time,
                Source: e.source ?? source,
                Resources: e.resources,
                DetailType: e['detail-type'],
                Detail: JSON.stringify(e.detail),
                EventBusName: e.eventBusName ?? eventBusName,
                TraceHeader: e.traceHeader,
            }),
        ),
    }
}
