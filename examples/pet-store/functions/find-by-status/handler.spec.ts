import { handler } from './handler'

import { PetArray } from '../../lib/models.type'

import { forAll, tuple } from '@skyleague/axioms'
import { context, httpEvent } from '@skyleague/event-horizon-dev'

test('handler', async () => {
    forAll(tuple(httpEvent(handler), await context()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x, ctx)
        return statusCode === 200 && PetArray.is(body) && body.every((p) => p.status === (x.query as any).status)
    })
})
