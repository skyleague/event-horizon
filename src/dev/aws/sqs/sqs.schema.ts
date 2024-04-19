import { $array, $dict, $enum, $object, $optional, $ref, $string, $union, $validator } from '@skyleague/therefore'

export const SQSMessageAttribute = $object({
    stringValue: $optional($string),
    binaryValue: $optional($string),
    stringListValues: $optional($array($string)),
    binaryListValues: $optional($array($string)),
    dataType: $union([$enum(['String', 'Number', 'Binary']), $string]),
})

export const SQSMessageAttributes = $dict($ref(SQSMessageAttribute))

export const SQSRecordAttributes = $object({
    AWSTraceHeader: $optional($string),
    ApproximateReceiveCount: $string,
    SentTimestamp: $string,
    SenderId: $string,
    ApproximateFirstReceiveTimestamp: $string,
    SequenceNumber: $optional($string),
    MessageGroupId: $optional($string),
    MessageDeduplicationId: $optional($string),
})

export const SQSRecord = $validator(
    $object({
        messageId: $string,
        receiptHandle: $string,
        body: $string,
        attributes: $ref(SQSRecordAttributes),
        messageAttributes: $ref(SQSMessageAttributes),
        md5OfBody: $string,
        eventSource: $string,
        eventSourceARN: $string,
        awsRegion: $string,
    }),
)

export const SQSEvent = $validator($object({ Records: $array($ref(SQSRecord)) }))
