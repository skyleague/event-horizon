import 'aws-sdk-client-mock-jest'
import 'aws-sdk-client-mock-jest/vitest'
import { afterAll, vi } from 'vitest'

import 'vitest'

vi.stubEnv('IS_DEBUG', 'true')

afterAll(() => {
    vi.restoreAllMocks()
})
