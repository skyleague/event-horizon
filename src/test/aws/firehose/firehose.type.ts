/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

import type { DefinedError, ValidateFunction } from 'ajv'

import { validate as FirehoseTransformationEventRecordValidator } from './schemas/firehose-transformation-event-record.schema.js'
import { validate as FirehoseTransformationEventValidator } from './schemas/firehose-transformation-event.schema.js'

export interface FirehoseRecordMetadata {
    shardId: string
    partitionKey: string
    approximateArrivalTimestamp: number
    sequenceNumber: string
    subsequenceNumber: string
}

export interface FirehoseTransformationEvent {
    invocationId: string
    deliveryStreamArn: string
    sourceKinesisStreamArn?: string | undefined
    region: string
    records: FirehoseTransformationEventRecord[]
}

export const FirehoseTransformationEvent = {
    validate: FirehoseTransformationEventValidator as ValidateFunction<FirehoseTransformationEvent>,
    get schema() {
        return FirehoseTransformationEvent.validate.schema
    },
    get errors() {
        return FirehoseTransformationEvent.validate.errors ?? undefined
    },
    is: (o: unknown): o is FirehoseTransformationEvent => FirehoseTransformationEvent.validate(o) === true,
    parse: (o: unknown): { right: FirehoseTransformationEvent } | { left: DefinedError[] } => {
        if (FirehoseTransformationEvent.is(o)) {
            return { right: o }
        }
        return { left: (FirehoseTransformationEvent.errors ?? []) as DefinedError[] }
    },
} as const

export interface FirehoseTransformationEventRecord {
    recordId: string
    approximateArrivalTimestamp: number
    data: string
    kinesisRecordMetadata?: FirehoseRecordMetadata | undefined
}

export const FirehoseTransformationEventRecord = {
    validate: FirehoseTransformationEventRecordValidator as ValidateFunction<FirehoseTransformationEventRecord>,
    get schema() {
        return FirehoseTransformationEventRecord.validate.schema
    },
    get errors() {
        return FirehoseTransformationEventRecord.validate.errors ?? undefined
    },
    is: (o: unknown): o is FirehoseTransformationEventRecord => FirehoseTransformationEventRecord.validate(o) === true,
    parse: (o: unknown): { right: FirehoseTransformationEventRecord } | { left: DefinedError[] } => {
        if (FirehoseTransformationEventRecord.is(o)) {
            return { right: o }
        }
        return { left: (FirehoseTransformationEventRecord.errors ?? []) as DefinedError[] }
    },
} as const