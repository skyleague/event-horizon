import type { RawRequest } from '../../types'

// @todo
export function warmup({
    isWarmingUp = () => false,
}: {
    isWarmingUp?: (request: RawRequest) => boolean
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
