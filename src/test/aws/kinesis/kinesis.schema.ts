import { $array, $ref, $string, $validator, $number, $object } from '@skyleague/therefore'

export const kinesisStreamRecordPayload = $object({
    approximateArrivalTimestamp: $number,
    data: $string,
    kinesisSchemaVersion: $string,
    partitionKey: $string,
    sequenceNumber: $string,
})

export const kinesisStreamRecord = $validator(
    $object({
        awsRegion: $string,
        eventID: $string,
        eventName: $string,
        eventSource: $string,
        eventSourceARN: $string,
        eventVersion: $string,
        invokeIdentityArn: $string,
        kinesis: $ref(kinesisStreamRecordPayload),
    })
)

export const kinesisStreamEvent = $validator(
    $object({
        Records: $array($ref(kinesisStreamRecord)),
    })
)
