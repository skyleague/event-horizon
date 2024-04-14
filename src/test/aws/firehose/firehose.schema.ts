import { $array, $integer, $object, $optional, $ref, $string, $validator } from '@skyleague/therefore'

export const firehoseRecordMetadata = $object({
    shardId: $string,
    partitionKey: $string,
    approximateArrivalTimestamp: $integer,
    sequenceNumber: $string,
    subsequenceNumber: $string,
})

export const firehoseTransformationEventRecord = $validator(
    $object({
        recordId: $string,
        approximateArrivalTimestamp: $integer,
        // Base64 encoded
        data: $string,
        kinesisRecordMetadata: $optional($ref(firehoseRecordMetadata), 'explicit'),
    })
)

export const firehoseTransformationEvent = $validator(
    $object({
        invocationId: $string,
        deliveryStreamArn: $string,
        sourceKinesisStreamArn: $optional($string, 'explicit'),
        region: $string,
        records: $array($ref(firehoseTransformationEventRecord)),
    })
)
