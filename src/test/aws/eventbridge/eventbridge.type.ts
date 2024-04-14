/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */
import AjvValidator from 'ajv'
import type { ValidateFunction } from 'ajv'

export interface EventBridgeEvent {
    id: string
    version: string
    account: string
    time: string
    region: string
    resources: string[]
    source: string
    'detail-type': string
    detail: unknown
    'replay-name'?: string
}

export const EventBridgeEvent = {
    validate: (await import('./schemas/event-bridge-event.schema.js'))
        .validate10 as unknown as ValidateFunction<EventBridgeEvent>,
    get schema() {
        return EventBridgeEvent.validate.schema
    },
    get errors() {
        return EventBridgeEvent.validate.errors ?? undefined
    },
    is: (o: unknown): o is EventBridgeEvent => EventBridgeEvent.validate(o) === true,
    assert: (o: unknown) => {
        if (!EventBridgeEvent.validate(o)) {
            throw new AjvValidator.ValidationError(EventBridgeEvent.errors ?? [])
        }
    },
} as const
