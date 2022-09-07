import { handler } from './handler'

import { Pet } from '../lib/models.type'

import { forAll, tuple } from '@skyleague/axioms'
import { arbitraryHttp, arbitraryContext } from '@skyleague/space-junk'

test('handler', async () => {
    forAll(tuple(await arbitraryHttp(handler), await arbitraryContext()), ([x, ctx]) => {
        const { statusCode, body } = handler.http.handler(x, ctx)
        return statusCode === 200 && Pet.is(body)
    })
})
