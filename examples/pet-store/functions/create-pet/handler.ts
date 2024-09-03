import { EventError } from '../../../../src/errors/event-error/event-error.js'
import { httpApiHandler } from '../../../../src/events/apigateway/event/http.js'
import { Pet } from '../../lib/models.type.js'

export const handler = httpApiHandler({
    description: 'Add a new pet to the store',
    http: {
        method: 'post',
        path: '/pet',
        schema: {
            body: Pet,
            responses: {
                200: Pet,
                404: EventError,
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
