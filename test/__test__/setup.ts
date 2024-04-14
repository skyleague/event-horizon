import {
    toHaveReceivedCommand,
    toHaveReceivedCommandOnce,
    toHaveReceivedCommandTimes,
    toHaveReceivedCommandWith,
    toHaveReceivedLastCommandWith,
    toHaveReceivedNthCommandWith,
    toReceiveCommand,
    toReceiveCommandOnce,
    toReceiveCommandTimes,
    toReceiveCommandWith,
    toReceiveLastCommandWith,
    toReceiveNthCommandWith,
} from 'aws-sdk-client-mock-vitest'
import { afterAll, vi } from 'vitest'
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
