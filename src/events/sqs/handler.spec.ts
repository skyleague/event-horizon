import { handleSqsEvent } from './handler'

import { random } from '@skyleague/axioms'
import { arbitraryContext } from '@skyleague/space-junk'
import type { SQSRecord } from 'aws-lambda'

test('batchItemFailures', async () => {
    await expect(
        handleSqsEvent(
            {
                sqs: {
                    schema: {},
                    // eslint-disable-next-line @typescript-eslint/require-await
                    handler: async () => {
                        throw new Error('wut')
                    },
                },
            },

            [{ messageId: 'message-x' } as SQSRecord],
            random(await arbitraryContext({}))
        )
    ).resolves.toMatchInlineSnapshot(`
        {
          "batchItemFailures": [
            {
              "itemIdentifier": "message-x",
            },
          ],
        }
    `)
})
