import { Pet, PetArray } from '../../lib/models.type.js'
import { Query } from './request.type.js'

import { array, random } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { httpApiHandler } from '../../../../src/events/http/http.js'

export const handler = httpApiHandler({
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
