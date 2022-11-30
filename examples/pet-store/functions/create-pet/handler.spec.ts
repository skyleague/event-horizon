import { handler } from './handler'

import { Pet } from '../../lib/models.type'

import { forAll, tuple } from '@skyleague/axioms'
import { context, httpEvent } from '@skyleague/event-horizon-dev'

test('handler', async () => {
    forAll(tuple(httpEvent(handler), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x, ctx)
        return statusCode === 200 && Pet.is(body)
    })
})
