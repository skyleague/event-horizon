import type { AWSError } from 'aws-sdk'

export function isAwsError(err: unknown): err is AWSError {
    return err instanceof Error && 'code' in err && 'time' in err
}

const errorCodes = {
    ConditionalCheckFailedException: 'ConditionalCheckFailedException',
} as const

export function isConditionalCheckFailedException(
    err: unknown
): err is Omit<AWSError, 'code'> & { code: typeof errorCodes.ConditionalCheckFailedException } {
    return isAwsError(err) && err.code === errorCodes.ConditionalCheckFailedException
}
