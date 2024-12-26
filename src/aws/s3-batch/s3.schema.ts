import { z } from 'zod'

export const s3BatchEventTask = z.object({
    taskId: z.string(),
    s3Key: z.string(),
    s3VersionId: z.union([z.string(), z.null()]),
    s3BucketArn: z.string(),
})

export const s3BatchEventJob = z.object({
    id: z.string(),
})

export const s3BatchEvent = z.object({
    invocationSchemaVersion: z.string(),
    invocationId: z.string(),
    job: s3BatchEventJob,
    tasks: z.array(s3BatchEventTask),
})
