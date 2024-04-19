import { $array, $integer, $object, $optional, $ref, $string, $validator } from '@skyleague/therefore'

export const s3EventRecordGlacierEventData = $object({
    restoreEventData: $object({
        lifecycleRestorationExpiryTime: $string,
        lifecycleRestoreStorageClass: $string,
    }),
})

export const s3EventRecord = $validator(
    $object({
        eventVersion: $string,
        eventSource: $string,
        awsRegion: $string,
        eventTime: $string,
        eventName: $string,
        userIdentity: $object({
            principalId: $string,
        }),
        requestParameters: $object({
            sourceIPAddress: $string,
        }),
        responseElements: $object({
            'x-amz-request-id': $string,
            'x-amz-id-2': $string,
        }),
        s3: $object({
            s3SchemaVersion: $string,
            configurationId: $string,
            bucket: $object({
                name: $string,
                ownerIdentity: $object({
                    principalId: $string,
                }),
                arn: $string,
            }),
            object: $object({
                key: $string,
                size: $integer,
                eTag: $string,
                versionId: $optional($string, 'explicit'),
                sequencer: $string,
            }),
        }),
        glacierEventData: $optional(s3EventRecordGlacierEventData, 'explicit'),
    })
)

export const s3Event = $validator(
    $object({
        Records: $array($ref(s3EventRecord)),
    })
)
