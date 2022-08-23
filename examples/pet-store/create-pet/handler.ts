import { event } from '../../../src/lib'
import { Pet } from '../lib/models.type'

export const handler = event({
    http: {
        method: 'post',
        url: '/pet',
        body: Pet,
        responses: {
            200: Pet,
        },
        handler: ({ body }, { logger }) => {
            logger.info('foo', {
                foo: 'bar',
            })

            return {
                statusCode: 200,
                body: body,
            }
        },
    },
    // sqs: {
    //     event: <schema>,
    //     batched: true
    // },
    // sns: {
    //     event: <schema>
    // },
})
