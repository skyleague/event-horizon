import { isAwsError } from './aws'

import { asTry } from '@skyleague/axioms'
import { SSM } from 'aws-sdk'

describe('isAwsError', () => {
    test('aws error is aws error', async () => {
        const ssm = new SSM()
        const reject = await asTry(() => ssm.getCalendarState({ CalendarNames: [''] }).promise())

        expect(isAwsError(reject)).toBeTruthy()
    }, 30_000)
})
