import { handler } from './handler'

import { PetArray } from '../lib/models.type'

import { asyncForAll, tuple } from '@skyleague/axioms'
import { arbitraryHttp, arbitraryContext } from '@skyleague/space-junk'

test('handler', async () => {
    await asyncForAll(tuple(await arbitraryHttp(handler), await arbitraryContext()), async ([x, ctx]) => {
        const { statusCode, body } = await handler.http.handler(x, ctx)
        return statusCode === 200 && PetArray.is(body) && body.every((p) => p.status === x.query.status)
    })
})
