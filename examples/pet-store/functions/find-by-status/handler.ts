import { array, random } from '@skyleague/axioms'
import { arbitrary } from '@skyleague/therefore'
import { z } from 'zod'
import { httpApiHandler } from '../../../../src/events/apigateway/event/http.js'
import { pet, petArray, status } from '../../lib/models.js'

export const handler = httpApiHandler({
    summary: 'Finds Pets by status',
    description: 'Multiple status values can be provided with comma separated strings',
    http: {
        method: 'get',
        path: '/pet/findByStatus',
        schema: {
            query: z.object({
                status: status,
            }),
            responses: {
                200: petArray,
            },
        },
        handler: ({ query }, { logger }) => {
            logger.info('query parameter given', {
                status: query.status,
            })

            const petsArb = array(arbitrary(pet))
            return {
                statusCode: 200,
                body: random(petsArb).filter((p) => p.status === query.status),
            }
        },
    },
})
