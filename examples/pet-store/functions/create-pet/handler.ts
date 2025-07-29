import { EventError } from '../../../../src/errors/event-error/event-error.js'
import { httpApiHandler } from '../../../../src/events/apigateway/event/http.js'
import { pet } from '../../lib/models.js'

export const handler = httpApiHandler({
    description: 'Add a new pet to the store',
    http: {
        method: 'post',
        path: '/pet',
        schema: {
            body: pet,
            responses: {
                200: pet,
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
