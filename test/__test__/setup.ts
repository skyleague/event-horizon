import {
    toReceiveCommandTimes,
    toHaveReceivedCommandTimes,
    toReceiveCommandOnce,
    toHaveReceivedCommandOnce,
    toReceiveCommand,
    toHaveReceivedCommand,
    toReceiveCommandWith,
    toHaveReceivedCommandWith,
    toReceiveNthCommandWith,
    toHaveReceivedNthCommandWith,
    toReceiveLastCommandWith,
    toHaveReceivedLastCommandWith,
} from 'aws-sdk-client-mock-vitest'
import { vi, afterAll } from 'vitest'
import { expect } from 'vitest'

import 'vitest'

expect.extend({
    toReceiveCommandTimes,
    toHaveReceivedCommandTimes,
    toReceiveCommandOnce,
    toHaveReceivedCommandOnce,
    toReceiveCommand,
    toHaveReceivedCommand,
    toReceiveCommandWith,
    toHaveReceivedCommandWith,
    toReceiveNthCommandWith,
    toHaveReceivedNthCommandWith,
    toReceiveLastCommandWith,
    toHaveReceivedLastCommandWith,
})
vi.stubEnv('IS_DEBUG', 'true')

afterAll(() => {
    vi.restoreAllMocks()
})
