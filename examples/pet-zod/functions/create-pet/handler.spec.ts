import { handler } from './handler.js'

import { httpApiEvent } from '../../../../src/dev/event-horizon/apigateway/event/http.js'
import { context } from '../../../../src/test/context/context.js'

import { forAll, tuple } from '@skyleague/axioms'
import { it } from 'vitest'
import { pet } from '../../lib/models.js'

it('handler', async () => {
    forAll(tuple(httpApiEvent(handler as any), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x as any, ctx)
        return statusCode === 200 && pet.safeParse(body).success
    })
})
