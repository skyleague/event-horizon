import type { CustomMatcher } from 'aws-sdk-client-mock-vitest'
import 'vitest'

declare module 'vitest' {
    interface Assertion<T = unknown> extends CustomMatcher<T> {}
    interface AsymmetricMatchersContaining extends CustomMatcher {}
}
