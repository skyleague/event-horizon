import { isObject } from '@skyleague/axioms'
import type { RawRequest } from '../raw-aws.js'

export const WARMER_EVENT_KEY = '__WARMER__'
export const WARMER_EVENT = { [WARMER_EVENT_KEY]: 'true' }

export function warmup({
    isWarmingUp = (request) => request === WARMER_EVENT_KEY || (isObject(request) && WARMER_EVENT_KEY in request),
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
