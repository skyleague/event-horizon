import type { RawRequest } from '../../handlers/aws'

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
