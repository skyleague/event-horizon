import { vi, afterAll } from 'vitest'

import 'aws-sdk-client-mock-jest'

vi.stubEnv('IS_DEBUG', 'true')

afterAll(() => {
    vi.restoreAllMocks()
})
