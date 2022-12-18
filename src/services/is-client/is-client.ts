import type { Client } from '@aws-sdk/types'

export function isAWSv3Client(x: Client<any, any, any> | unknown): x is Client<any, any, any> {
    return (
        typeof x === 'object' &&
        x !== null &&
        'send' in x &&
        typeof x.send === 'function' &&
        'destroy' in x &&
        typeof x.destroy === 'function' &&
        'config' in x &&
        'middlewareStack' in x
    )
}
