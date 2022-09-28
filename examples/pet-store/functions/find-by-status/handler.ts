import { Query } from './request.type'

import { httpHandler } from '../../../../src'
import { Pet, PetArray } from '../../lib/models.type'

import { array, random } from '@skyleague/axioms'
import { toArbitrary } from '@skyleague/therefore'

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
        handler: async ({ query }, { logger }) => {
            logger.info('query parameter given', {
                status: query.status,
            })

            const petsArb = array(await toArbitrary(Pet))
            return {
                statusCode: 200,
                body: random(petsArb).filter((p) => p.status === query.status),
            }
        },
    },
})
