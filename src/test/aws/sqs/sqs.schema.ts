import { $array, $dict, $enum, $object, $optional, $ref, $string, $validator, $union } from '@skyleague/therefore'

export const SQSMessageAttribute = $object({
    stringValue: $optional($string, 'explicit'),
    binaryValue: $optional($string, 'explicit'),
    stringListValues: $optional($array($string), 'explicit'),
    binaryListValues: $optional($array($string), 'explicit'),
    dataType: $union([$enum(['String', 'Number', 'Binary']), $string]),
})

export const SQSMessageAttributes = $dict($ref(SQSMessageAttribute))

export const SQSRecordAttributes = $object({
    AWSTraceHeader: $optional($string, 'explicit'),
    ApproximateReceiveCount: $string,
    SentTimestamp: $string,
    SenderId: $string,
    ApproximateFirstReceiveTimestamp: $string,
    SequenceNumber: $optional($string, 'explicit'),
    MessageGroupId: $optional($string, 'explicit'),
    MessageDeduplicationId: $optional($string, 'explicit'),
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
    })
)

export const SQSEvent = $validator($object({ Records: $array($ref(SQSRecord)) }))
