import { $array, $const, $object, $ref, $string, $union, $validator } from '@skyleague/therefore'

export const s3BatchEventTask = $validator(
    $object({
        taskId: $string,
        s3Key: $string,
        s3VersionId: $union([$string, $const(null)]),
        s3BucketArn: $string,
    })
)

export const s3BatchEventJob = $object({
    id: $string,
})

export const s3BatchEvent = $validator(
    $object({
        invocationSchemaVersion: $string,
        invocationId: $string,
        job: $ref(s3BatchEventJob),
        tasks: $array($ref(s3BatchEventTask)),
    })
)
