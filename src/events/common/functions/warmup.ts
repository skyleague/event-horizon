import type { RawRequest } from '../raw-aws.js'

export function warmup({
    isWarmingUp = (request) => request === '__WARMER__',
}: {
    isWarmingUp?: (request: RawRequest | string) => boolean
} = {}) {
    return {
        before: (request: RawRequest) => {
            if (isWarmingUp(request)) {
                return true
            }
            return false
        },
    }
}
