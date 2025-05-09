import { isObject } from '@skyleague/axioms'
import type { RawRequest } from '../raw-aws.js'

export function warmup({
    isWarmingUp = (request) => request === '__WARMER__' || (isObject(request) && '__WARMER__' in request),
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
