import { httpHandler } from '../../../../src'
import { Pet } from '../../lib/models.type'

export const handler = httpHandler({
    description: 'Add a new pet to the store',
    http: {
        method: 'post',
        path: '/pet',
        schema: {
            body: Pet,
            responses: {
                200: Pet,
            },
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
})
