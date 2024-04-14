/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as KinesisStreamEventValidator } from './schemas/kinesis-stream-event.schema.js'
import { validate as KinesisStreamRecordValidator } from './schemas/kinesis-stream-record.schema.js'

export interface KinesisStreamEvent {
    Records: KinesisStreamRecord[]
}

export const KinesisStreamEvent = {
    validate: KinesisStreamEventValidator as ValidateFunction<KinesisStreamEvent>,
    get schema() {
        return KinesisStreamEvent.validate.schema
    },
    get errors() {
        return KinesisStreamEvent.validate.errors ?? undefined
    },
    is: (o: unknown): o is KinesisStreamEvent => KinesisStreamEvent.validate(o) === true,
    parse: (o: unknown): { right: KinesisStreamEvent } | { left: DefinedError[] } => {
        if (KinesisStreamEvent.is(o)) {
            return { right: o }
        }
        return { left: (KinesisStreamEvent.errors ?? []) as DefinedError[] }
    },
} as const

export interface KinesisStreamRecord {
    awsRegion: string
    eventID: string
    eventName: string
    eventSource: string
    eventSourceARN: string
    eventVersion: string
    invokeIdentityArn: string
    kinesis: KinesisStreamRecordPayload
}

export const KinesisStreamRecord = {
    validate: KinesisStreamRecordValidator as ValidateFunction<KinesisStreamRecord>,
    get schema() {
        return KinesisStreamRecord.validate.schema
    },
    get errors() {
        return KinesisStreamRecord.validate.errors ?? undefined
    },
    is: (o: unknown): o is KinesisStreamRecord => KinesisStreamRecord.validate(o) === true,
    parse: (o: unknown): { right: KinesisStreamRecord } | { left: DefinedError[] } => {
        if (KinesisStreamRecord.is(o)) {
            return { right: o }
        }
        return { left: (KinesisStreamRecord.errors ?? []) as DefinedError[] }
    },
} as const

export interface KinesisStreamRecordPayload {
    approximateArrivalTimestamp: number
    data: string
    kinesisSchemaVersion: string
    partitionKey: string
    sequenceNumber: string
}