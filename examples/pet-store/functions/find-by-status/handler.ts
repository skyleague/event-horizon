import { Query } from './request.type.js'

import { httpHandler } from '../../../../src/events/http/http.js'
import { Pet, PetArray } from '../../lib/models.type.js'

import { array, random } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'

export const handler = httpHandler({
    summary: 'Finds Pets by status',
    description: 'Multiple status values can be provided with comma separated strings',
    http: {
        method: 'get',
        path: '/pet/findByStatus',
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

            const petsArb = array(arbitrary(Pet))
            return {
                statusCode: 200,
                body: random(petsArb).filter((p) => p.status === query.status),
            }
        },
    },
})
