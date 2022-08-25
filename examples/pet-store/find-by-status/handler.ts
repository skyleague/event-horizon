import { Query } from './request.type'

import { event } from '../../../src/lib'
import { PetArray } from '../lib/models.type'

export const handler = event({
    http: {
        method: 'get',
        url: '/pet/findByStatus',
        schema: {
            query: Query,
            responses: {
                200: PetArray,
            },
        },
        handler: ({ query }, { logger }) => {
            logger.info('query parameter given', {
                status: query.status,
            })

            return {
                statusCode: 200,
                body: [{ name: 'foo', photoUrls: ['example.com'] }],
            }
        },
    },
})
