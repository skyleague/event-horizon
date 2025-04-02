/**
 * Generated by @skyleague/therefore
 * Do not manually touch this
 */
/* eslint-disable */

export interface KinesisFirehoseRecord {
    recordId: string
    approximateArrivalTimestamp: number
    kinesisRecordMetadata?: KinesisRecordMetadata | null | undefined
    data: string
}

export interface KinesisFirehoseSchema {
    invocationId: string
    deliveryStreamArn: string
    region: string
    sourceKinesisStreamArn?: string | undefined
    records: [KinesisFirehoseRecord, ...KinesisFirehoseRecord[]]
}

export type KinesisRecordMetadata = {
    shardId: string
    partitionKey: string
    approximateArrivalTimestamp: number
    sequenceNumber: string
    subsequenceNumber: number
} | null
