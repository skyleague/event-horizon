/**
 * Generated by @skyleague/therefore@v1.0.0-local
 * Do not manually touch this
 */
/* eslint-disable */

export interface KinesisDataStreamRecord {
    eventSource: 'aws:kinesis'
    eventVersion: string
    eventID: string
    eventName: 'aws:kinesis:record'
    awsRegion: string
    invokeIdentityArn: string
    eventSourceARN: string
    kinesis: KinesisDataStreamRecordPayload
}

export interface KinesisDataStreamRecordPayload {
    kinesisSchemaVersion: string
    partitionKey: string
    sequenceNumber: string
    approximateArrivalTimestamp: number
    data: string
}

export interface KinesisDataStreamSchema {
    Records: KinesisDataStreamRecord[]
}
