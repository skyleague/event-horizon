import type { PutEventsCommandInput } from '@aws-sdk/client-eventbridge'
import { omitUndefined } from '@skyleague/axioms'
import type { Simplify } from '@skyleague/axioms/types'
import type { EventBridgeSchema } from '../../dev/aws/eventbridge/eventbridge.type.js'

export type PutEventsRequestEntry = {
    time?: Date
    source: string
    resources?: string[]
    eventBusName?: string
    traceHeader?: string
}

type OutputToInput<T extends Partial<EventBridgeSchema>> = Simplify<
    Partial<PutEventsRequestEntry> & Pick<T, 'detail' | 'detail-type'>
>

type EventBridgeEventInput = Partial<PutEventsRequestEntry> & { detail: unknown; 'detail-type': string }
type EventEntriesParams<Events> = Events extends (infer U)[]
    ? {
          events: Events
      } & (U extends { source: string } ? { source?: string } : { source: string }) &
          (U extends { eventBusName: string } ? { eventBusName?: string } : { eventBusName: string })
    : never

export function eventEntries<Events extends EventBridgeSchema[]>({
    eventBusName,
    events,
    source,
}: EventEntriesParams<OutputToInput<Events[number]>[]>): PutEventsCommandInput
export function eventEntries<Events extends EventBridgeEventInput[]>({
    eventBusName,
    events,
    source,
}: EventEntriesParams<Events>): PutEventsCommandInput
export function eventEntries<Events extends EventBridgeEventInput[]>({
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
