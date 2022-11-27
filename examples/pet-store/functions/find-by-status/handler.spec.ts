import { handler } from './handler'

import { PetArray } from '../../lib/models.type'

import { asyncForAll, tuple } from '@skyleague/axioms'
import { context, httpEvent } from '@skyleague/event-horizon-dev'

test('handler', async () => {
    await asyncForAll(tuple(httpEvent(handler), await context()), async ([x, ctx]) => {
        const { statusCode, body } = await handler.http.handler(x, ctx)
        return statusCode === 200 && PetArray.is(body) && body.every((p) => p.status === x.query.status)
    })
})
