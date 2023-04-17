import { it } from 'vitest'
import { handler } from './handler.js'

import { Pet } from '../../lib/models.type.js'

import { forAll, tuple } from '@skyleague/axioms'
import { context, httpEvent } from '@skyleague/event-horizon-dev'

it('handler', async () => {
    forAll(tuple(httpEvent(handler as any), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x as any, ctx)
        return statusCode === 200 && Pet.is(body)
    })
})
